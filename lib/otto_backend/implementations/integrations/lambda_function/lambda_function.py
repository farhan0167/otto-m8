import requests
import json

from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType
)
from core.input_parser.integration_inp_parser import BasicIntegrationInputParser

class LambdaFunction(BaseImplementation):
    display_name = 'Lambda Function'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="lambda_function_name", display_name="Lambda Function", 
            is_run_config=True, default_value=None, show_in_ui=False,
            type=FieldType.LAMBDAS_DROPDOWN.value,
        ),
    ])
    
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
        try:
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
        
        except requests.exceptions.ConnectionError:
            print("Failed to connect using host.docker.internal, trying localhost")
            try:
                response = requests.request(
                    method='GET',
                    url=f'http://localhost:8000/get_lambda_by_name/{self.function_name}',
                    headers={'Content-Type': 'application/json'}
                )
            except requests.exceptions.ConnectionError:
                raise Exception("Failed to connect to lambda function using localhost")
            lambda_function = response.json()
            url = lambda_function['deployment_url']
            return url
