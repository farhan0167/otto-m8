import requests
import json
from tasks.task import Task


class OllamaServerGenarate(Task):
    """Task definition of the Ollama Generate endpoint."""
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        self.ollama_server_endpoint = (
            self.run_config.get('endpoint') 
            if self.run_config.get('endpoint') is not None 
            else 'http://host.docker.internal:11434/api/generate'
        )
        self.request_payload = self.create_payload_from_run_config()

    def run(self, _input:str) -> dict:
        self.request_payload['prompt'] = _input
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
        