import json
import requests
from otto_backend.db.models import WorkflowTemplates
from otto_backend.db.db_engine import get_session

from otto_m8.core.config import OttoConfig

config = OttoConfig()
db = get_session()

class OttoRun:
    """ 
    Object to interact with the workflow. 
    """
    def __init__(
        self,
        workflow_url: str,
        config: OttoConfig = config
    ):
        self.workflow_url = workflow_url
        self.base_url = config.base_url
        self.template = self.get_template()
        
    def get_template(self):
        """Method to get the template for the workflow"""
        template = db.query(WorkflowTemplates).filter(WorkflowTemplates.deployment_url == self.workflow_url).first()
        if template is None:
            raise Exception("Template not found")
        return template
    
    def create_empty_payload(self):
        """Method to get the input blocks for the workflow"""
        backend_template = self.template.backend_template
        backend_template = json.loads(backend_template)
        inputs = backend_template['input']
        input_block_names = {}
        for input_block in inputs:
            input_block_names[input_block['name']] = None
        return input_block_names
    
    def run(self, payload: dict):
        """Method to run the workflow"""
        response = requests.post(
            self.workflow_url,
            json={
                "template_id": self.template.id,
                "data": payload
            }
        )
        if not response.ok:
            raise Exception("Workflow failed")
        response = response.json()
        response = json.loads(response['message'])
        return response