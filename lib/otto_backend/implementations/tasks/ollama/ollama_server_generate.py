import requests
import json
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)
from core.input_parser.prompt_template import PromptTemplate

class OllamaServerGenarate(BaseImplementation):
    """Task definition of the Ollama Generate endpoint."""
    display_name = 'Ollama Generate'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="model", 
            display_name="Model", 
            is_run_config=True, 
            default_value='llama3'
        ),
        Field(
            name="endpoint", 
            display_name="Endpoint", 
            is_run_config=True, 
            show_in_ui=False
        ),
        Field(
            name="system", 
            display_name="System Message", 
            is_run_config=True, 
            show_in_ui=False
        ),
        Field(
            name="prompt", 
            display_name="Prompt Template", 
            is_run_config=True, 
            show_in_ui=False
        ),
    ])
    
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        self.ollama_server_endpoint = (
            self.run_config.get('endpoint') 
            if self.run_config.get('endpoint') is not None 
            else 'http://host.docker.internal:11434/api/generate'
        )
        self.request_payload = self.create_payload_from_run_config()

    def run(self, input_:dict) -> dict:
        # Create prompt
        parse_input = PromptTemplate(
            input_=input_, 
            template=self.prompt_template
        )
        prompt_template = parse_input()
        
        self.request_payload['prompt'] = prompt_template
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request(
            "POST", url=self.ollama_server_endpoint, 
            headers=headers, 
            data=json.dumps(self.request_payload)
        )
        response = response.json()
        return json.loads(json.dumps(response))

        
        
    
    def create_payload_from_run_config(self) -> dict:
        payload = {"stream": False}
        model = self.run_config.get('model')
        
        prompt_template = self.run_config.get('prompt_template')
        self.prompt_template = prompt_template
        
        if model is None:
            raise Exception("Model is not specified in the run config")
        payload['model'] = model
        temperature = self.run_config.get('temperature')
        if temperature is not None:
            payload['temperature'] = temperature
        system_message = self.run_config.get('system')
        if system_message is not None:
            payload['system'] = system_message
        return payload
        