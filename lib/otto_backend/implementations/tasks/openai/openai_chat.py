import requests
import json

from openai import OpenAI


from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType
)
from extensions.llm_tools.openai_tool import OpenAITool
from core.input_parser.prompt_template import PromptTemplate


class OpenAIChat(BaseImplementation):
    """Task definition of the OpenAI Chat Completion."""
    display_name = 'OpenAI Chat Completion'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="model", 
            display_name="Model", 
            is_run_config=True, 
            default_value='gpt-4o-mini'
        ),
        Field(
            name="openai_api_key", 
            display_name="API Key", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.PASSWORD.value
        ),
        Field(
            name="system", 
            display_name="System Message", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.TEXTAREA.value
        ),
        Field(
            name="prompt_template", 
            display_name="Prompt Template", 
            is_run_config=True, 
            show_in_ui=False, 
            type=FieldType.PROMPT_TEMPLATE.value
        ),
        Field(
            name="tools", 
            display_name="Tools", 
            is_run_config=True, 
            default_value=[], 
            show_in_ui=False, 
            type=FieldType.TOOL_LIST.value
        ),
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
        
        # Create prompt
        parse_input = PromptTemplate(
            input_=input_, 
            template=self.prompt_template
        )
        prompt_template = parse_input()
        
        # Flag to determine if a function is available to be called
        make_function_call = False
        messages.append({"role": "user", "content": prompt_template})

        # Make the first call.
        response = self.openAI_client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=self.tools
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
        if not choice['message'].get('tool_calls'):
            return json.loads(json.dumps(response))
        
        # If model chose to call tools, then call the available tools.
        if choice['message'].get('tool_calls'):
            for tool_call in choice['message']['tool_calls']:
                tool_name = tool_call['function']['name']
                function_to_call = self.available_tools.get(tool_name)
                if function_to_call is None:
                    continue
                make_function_call = True
                function_params = json.loads(tool_call['function']['arguments'])
                function_response = function_to_call.run(
                    # TODO: By json.loads here, we are assuming that the input is json. Can we enforce that via some data structure?
                    {'data' : json.dumps(function_params)}
                )
                messages.append({
                    "role": "tool",
                    "content": str(function_response),
                    "tool_call_id": tool_call['id']
                })
        # If no functions were available for the tools, simply return the response
        if not make_function_call:
            return json.loads(json.dumps(response))
        # Else, utilize the function response to query the OpenAI API.
        response = self.openAI_client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=self.tools
        )
        response = response.dict()
        choice = response['choices'][0]
        messages.append(
            self.openai_response_get_message(
                response_choice=choice
            )
        )

        response['conversation'] = messages[1:]
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
        if response_choice["message"]['tool_calls']:
            message['tool_calls'] = response_choice["message"]["tool_calls"]
        return message
        
        
    
    def create_payload_from_run_config(self) -> dict:

        model = self.run_config.get('model', 'gpt-4o-mini')
        self.model = model
        
        prompt_template = self.run_config.get('prompt_template')
        self.prompt_template = prompt_template
            
        # Process any tools available
        tools = self.run_config.get('tools')
        if tools:
            self.tools = []
            for tool in tools:
                openai_tool = OpenAITool()
                tool_schema = openai_tool.process_tool(tool)
                self.tools.append(tool_schema)
                self.available_tools[ tool['name'] ] = openai_tool.implements
    
    def insert_system_message(self):
        system_message = self.run_config.get('system')
        return {"role": "system", "content": system_message}
        
        