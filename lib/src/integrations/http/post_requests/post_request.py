from integrations.integration import Integration
import requests
import json

class HTTPPostRequest(Integration):
    def __init__(self, run_config:dict) -> None:
        self.run_config = run_config
        self.content_type = 'application/json'
        self.endpoint = self.run_config.get('endpoint')
        if 'localhost' in self.endpoint:
            self.endpoint = self.endpoint.replace('localhost', 'host.docker.internal')
        self.method = 'POST'
        
    def run(self, input_:dict = None):
        headers = {
            'Content-Type': self.content_type
        }
        response = requests.request(
            self.method, url=self.endpoint, 
            headers=headers, 
            json=input_
        )
        response = self.post_process_response(response)
        return response
    
    def post_process_response(self, response):
        if response.status_code == 200:
            response = response.json()
        else:
            response = response.text
        return response
        