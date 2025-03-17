import requests
import json
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType
)
from extensions.llm_tools.ollama_tool import OllamaTool
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
            is_run_config=True, show_in_ui=False
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
        self.available_tools = {}
        self.request_payload = self.create_payload_from_run_config()
    
    def run(self, input_:dict) -> dict:
        self.request_payload['messages'] = []
        self.request_payload['messages'].append(self.insert_system_message())
        
        # Create prompt
        parse_input = PromptTemplate(
            input_=input_, 
            template=self.prompt_template
        )
        prompt_template = parse_input()
        
        # Flag to determine if a function is available to be called
        make_function_call = False
        self.request_payload['messages'].append({"role": "user", "content": prompt_template})
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
        