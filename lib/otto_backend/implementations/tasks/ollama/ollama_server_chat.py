import requests
import json
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType,
    StaticDropdownOption
)
from extensions.llm_tools.ollama_tool import OllamaTool
from extensions.llm_memory.types import LLMChatMemoryType
from extensions.llm_memory.chat_memory import ChatMemory
from extensions.llm_memory.base import BaseMemory
from core.input_parser.prompt_template import PromptTemplate


class OllamaServerChat(BaseImplementation):
    """Task definition of the Ollama Generate endpoint."""
    display_name = 'Ollama Chat'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="model", 
            display_name="Model", 
            is_run_config=True, default_value='llama3'
        ),
        Field(
            name="endpoint", 
            display_name="Endpoint",
            default_value='http://localhost:11434/api/chat', 
            is_run_config=True, show_in_ui=False
        ),
        Field(
            name="chat_memory",
            display_name="Memory",
            is_run_config=True,
            show_in_ui=False,
            default_value='',
            type=FieldType.STATIC_DROPDOWN.value,
            metadata={
                "dropdown_options": [
                    StaticDropdownOption(
                        label="No Memory", value=''
                    ).__dict__,
                    StaticDropdownOption(
                        label="Basic Memory", value=LLMChatMemoryType.BASIC_MEMORY.value
                    ).__dict__
                ]
            }
        ),
        Field(
            name="system", 
            display_name="System Message", 
            is_run_config=True, show_in_ui=False, 
            type=FieldType.TEXTAREA.value
        ),
        Field(
            name="prompt_template", 
            display_name="Prompt Template", 
            is_run_config=True, show_in_ui=False, 
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
        self.ollama_server_endpoint = (
            self.run_config.get('endpoint') 
            if self.run_config.get('endpoint') is not None 
            else 'http://host.docker.internal:11434/api/chat'
        )
        # TODO: identify fix for this. Refer Issue #38
        if 'localhost' in self.ollama_server_endpoint:
            self.ollama_server_endpoint = self.ollama_server_endpoint.replace(
                'localhost', 'host.docker.internal'
            )
        self.chat_memory:BaseMemory = ChatMemory().initialize(
            memory_type=self.run_config.get('chat_memory'),
            block_uuid=run_config['block_uuid']
        )
        self.available_tools = {}
        self.request_payload = self.create_payload_from_run_config()
    
    def run(self, input_:dict) -> dict:
        self.request_payload['messages'] = []
        
        # Create prompt
        parse_input = PromptTemplate(
            input_=input_, 
            template=self.prompt_template
        )
        prompt_template = parse_input()
        
        # Flag to determine if a function is available to be called
        make_function_call = False
        
        self.request_payload['messages'] = self.chat_memory.get(
            user_prompt={
                'role': 'user',
                'content': prompt_template
            }
        )
        self.request_payload['messages'] = (
            [self.insert_system_message()] + 
            self.request_payload['messages']
        )

        headers = {
            'Content-Type': 'application/json'
        }
        # Make the first call.
        response = requests.request(
            "POST", url=self.ollama_server_endpoint, 
            headers=headers, 
            data=json.dumps(self.request_payload)
        )
        response = response.json()
        self.request_payload['messages'].append(response['message'])
        self.chat_memory.put(
            messages=self.request_payload['messages']
        )
        
        messages = self.request_payload['messages'][1:]
        response['conversation'] = messages
        
        # If model chose not to call any tools, return the response
        if not response['message'].get('tool_calls'):
            return json.loads(json.dumps(response))
        
        # If model chose to call tools, then call the available tools.
        if response['message'].get('tool_calls'):
            for tool_call in response['message']['tool_calls']:
                tool_name = tool_call['function']['name']
                function_to_call = self.available_tools.get(tool_name)
                if function_to_call is None:
                    continue
                make_function_call = True
                function_params = tool_call['function']['arguments']
                function_response = function_to_call.run(
                    # TODO: By json.loads here, we are assuming that the input is json. Can we enforce that via some data structure?
                    {'data' : json.dumps(function_params)}
                )
                self.request_payload['messages'].append({
                    "role": "tool",
                    "content": str(function_response)
                })
                self.chat_memory.put(
                    messages=self.request_payload['messages']
                )
        # If no functions were available for the tools, simply return the response
        if not make_function_call:
            return json.loads(json.dumps(response))
        response = requests.request(
            "POST", url=self.ollama_server_endpoint, 
            headers=headers, 
            data=json.dumps(self.request_payload)
        )
        response = response.json()
        self.request_payload['messages'].append(response['message'])
        self.chat_memory.put(
            messages=self.request_payload['messages']
        )
        
        messages = self.request_payload['messages'][1:]
        response['conversation'] = messages
        
        return json.loads(json.dumps(response))
        
        
    
    def create_payload_from_run_config(self) -> dict:
        payload = {"stream": False, "tools": []}
        model = self.run_config.get('model')
        if model is None:
            raise Exception("Model is not specified in the run config")
        
        prompt_template = self.run_config.get('prompt_template')
        self.prompt_template = prompt_template
        
        payload['model'] = model
        temperature = self.run_config.get('temperature')
        if temperature is not None:
            payload['temperature'] = temperature
        # Process any tools available
        tools = self.run_config.get('tools')
        if tools:
            for tool in tools:
                ollama_tool = OllamaTool()
                tool_schema = ollama_tool.process_tool(tool)
                payload['tools'].append(tool_schema)
                self.available_tools[ tool['name'] ] = ollama_tool.implements
        return payload
    
    def insert_system_message(self):
        system_message = self.run_config.get('system')
        return {"role": "system", "content": system_message}
        