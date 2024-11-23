import requests
import json

from implementations.base import BaseImplementation
from utils.input_parser.integration_inp_parser import BasicIntegrationInputParser

class LambdaFunction(BaseImplementation):
    def __init__(self, run_config: dict) -> None:
        self.run_config = run_config
        self.function_name = self.run_config.get('lambda_function_name')
        self.deployment_url = self.get_lambda_function()
        
    def run(self, input_ = None):
        parse_input = BasicIntegrationInputParser(input_)
        # TODO: By json.loads here, we are assuming that the input is json. Can we enforce that via some data structure?
        data = {"data" : parse_input()}
        payload = {
            "event": data,
            "context": {
                "run_config": self.run_config
            }
        }
        response = requests.request(
            method='POST',
            url=self.deployment_url,
            json=payload
        )
        if response.status_code != 200:
            raise Exception(response.text)
        return response.json()
    
    def get_lambda_function(self):
        # TODO: Add support for local host
        response = requests.request(
            method='GET',
            url=f'http://host.docker.internal:8000/get_lambda_by_name/{self.function_name}',
            headers={'Content-Type': 'application/json'}
        )
        if response.status_code != 200:
            raise Exception(response.text)
        lambda_function = response.json()
        url = lambda_function['deployment_url']
        if 'localhost' in url:
            url = url.replace('http://localhost', 'http://host.docker.internal')
        return url