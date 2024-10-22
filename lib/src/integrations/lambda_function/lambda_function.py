import requests
import json

from integrations.integration import Integration
from db.db_engine import get_session
from db.models.lambdas import Lambdas


class LambdaFunction(Integration):
    def __init__(self, run_config: dict) -> None:
        self.run_config = run_config
        self.function_name = self.run_config.get('lambda_function_name')
        self.deployment_url = self.get_lambda_function()
        
    def run(self, input_ = None):
        data = {"data": input_}
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