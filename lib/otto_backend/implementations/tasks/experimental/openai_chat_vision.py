import requests
import json
import base64

from openai import OpenAI


from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType
)
from core.input_parser.prompt_template import PromptTemplate


class OpenAIChatVision(BaseImplementation):
    """Task definition of the OpenAI Chat Completion."""
    display_name = 'OpenAI Vision'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(name="model", display_name="Model", is_run_config=True, default_value='gpt-4o-mini'),
        Field(name="openai_api_key", display_name="API Key", is_run_config=True, show_in_ui=False, type=FieldType.PASSWORD.value),
        Field(name="system", display_name="System Message", is_run_config=True, show_in_ui=False, type=FieldType.TEXTAREA.value),
        Field(name="prompt_template", display_name="Prompt Template", is_run_config=True, show_in_ui=False, type=FieldType.PROMPT_TEMPLATE.value),
    ])
    
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        if not self.run_config.get('openai_api_key'):
            raise Exception("OpenAI API key is not specified in the run config")
        self.openAI_client = OpenAI(
            api_key=self.run_config.get('openai_api_key'),
        ) 
        self.messages = []
        self.available_tools = {}
        self.model = 'gpt-4o-mini'
        self.tools = None
        self.prompt_template = None
        self.create_payload_from_run_config()
    
    def run(self, input_:dict) -> dict:
        messages = []
        messages.append(self.insert_system_message())
        image_input = base64.b64encode(input_["img"]).decode("utf-8")
        # Create prompt
        parse_input = PromptTemplate(
            input_=input_, 
            template=self.prompt_template
        )
        prompt_template = parse_input()

        messages.append({
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"{prompt_template}",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_input}"},
                },
            ],
        })


        # Make the first call.
        response = self.openAI_client.chat.completions.create(
            model=self.model,
            messages=messages
        )
        response = response.dict()
        choice = response['choices'][0]
        messages.append(
            self.openai_response_get_message(
                response_choice=choice
            )
        )
        response['conversation'] = messages[1:]
        # If model chose not to call any tools, return the response
        return json.loads(json.dumps(response))
    
    def openai_response_get_message(self, response_choice):
        """
        Process the response from OpenAI's chat.completions.create API call, 
        returning the message that should be appended to the conversation.

        Args:
            response_choice: The response from OpenAI's chat.completions.create API call
        
        Returns:
            A dictionary containing the message to be appended to the conversation
        """
        message = {"role": ""}
        #response_choice = response.choices[0]
        message['role'] = response_choice["message"]["role"]
        if response_choice["message"]['content']:
            message['content'] = response_choice["message"]["content"]
        return message
        
        
    
    def create_payload_from_run_config(self) -> dict:

        model = self.run_config.get('model', 'gpt-4o-mini')
        self.model = model
        
        prompt_template = self.run_config.get('prompt_template')
        self.prompt_template = prompt_template
    
    def insert_system_message(self):
        system_message = self.run_config.get('system')
        return {"role": "system", "content": system_message}
        
        