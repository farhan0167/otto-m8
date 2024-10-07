import requests
import json
from tasks.task import Task
from utils.llm_tools.ollama_tool import OllamaTool


class OllamaServerChat(Task):
    """Task definition of the Ollama Generate endpoint."""
    def __init__(self, run_config:dict) -> None:
        super().__init__()
        self.run_config = run_config
        self.ollama_server_endpoint = (
            self.run_config.get('endpoint') 
            if self.run_config.get('endpoint') is not None 
            else 'http://host.docker.internal:11434/api/chat'
        )
        self.messages = []
        self.request_payload = self.create_payload_from_run_config()

    def run(self, input_:str) -> dict:
        self.request_payload['messages'].append({"role": "user", "content": input_})
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.request(
            "POST", url=self.ollama_server_endpoint, 
            headers=headers, 
            data=json.dumps(self.request_payload)
        )
        response = response.json()
        self.request_payload['messages'].append(response['message'])
        self.messages = self.request_payload['messages']
        response['conversation'] = self.messages
        return json.loads(json.dumps(response))

        
        
    
    def create_payload_from_run_config(self) -> dict:
        payload = {"stream": False, "tools": []}
        model = self.run_config.get('model')
        if model is None:
            raise Exception("Model is not specified in the run config")
        payload['model'] = model
        temperature = self.run_config.get('temperature')
        if temperature is not None:
            payload['temperature'] = temperature
        system_message = self.run_config.get('system')
        if system_message is not None:
            self.messages.append({"role": "system", "content": system_message})
            payload['messages'] = self.messages
        # Process any tools available
        tools = self.run_config.get('tools')
        if tools is not None:
            for tool in tools:
                tool = OllamaTool().process_tool(tool)
                payload['tools'].append(tool)
        return payload
        