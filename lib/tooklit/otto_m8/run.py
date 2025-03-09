import json
import requests
from otto_backend.core.utils import convert_frontend_tmp_2_backend_tmp
from otto_backend.db.models import (
    WorkflowTemplates,
    DraftTemplate
)
from otto_backend.db.db_engine import get_session, toolkit_get_session
from otto_m8.core.config import OttoConfig

config = OttoConfig()

class OttoRun:
    """ 
    Object to interact with the workflow. 
    """
    def __init__(
        self,
        workflow_url: str = None,
        workflow_name: str = None,
        config: OttoConfig = config
    ):
        if workflow_url and workflow_name:
            raise Exception("Only one of workflow_url or workflow_name should be provided")
        self.is_draft_workflow = False
        self.backend_template = None
        self.workflow_url = workflow_url
        self.workflow_name = workflow_name
        self.base_url = config.base_url
        self.__db = toolkit_get_session(config.database_host)
        self.template = self.get_template()
        
    def get_template(self):
        """Method to get the template for the workflow"""
        if self.workflow_url:
            template = self.__db.query(WorkflowTemplates).filter(
                WorkflowTemplates.deployment_url == self.workflow_url
            ).first()
            self.backend_template = template.backend_template if template else None
            self.workflow_url = template.deployment_url if template else None
        elif self.workflow_name:
            template = self.__db.query(WorkflowTemplates).filter(
                WorkflowTemplates.name == self.workflow_name
            ).first()
            self.backend_template = template.backend_template if template else None
            self.workflow_url = template.deployment_url if template else None
            if not template:
                template = self.__db.query(DraftTemplate).filter(
                    DraftTemplate.name == self.workflow_name
                ).first()
                if template:
                    self.is_draft_workflow = True
                    self.workflow_url = f"{self.base_url}/test_workflow"
                    frontend_template = json.loads(template.frontend_template)
                    self.backend_template = convert_frontend_tmp_2_backend_tmp(
                        frontend_template['nodes'], 
                        frontend_template['edges']
                    )
        if template is None:
            raise Exception("Template not found")
        return template
    
    def create_empty_payload(self):
        """Method to get the input blocks for the workflow"""
        backend_template = json.loads(self.backend_template)
        inputs = backend_template['input']
        input_block_names = {}
        for input_block in inputs:
            input_block_names[input_block['name']] = None
        return input_block_names
    
    def run(self, payload: dict):
        """Method to run the workflow"""
        if self.is_draft_workflow:
            json_payload = {
                "data": payload,
                "backend_template": json.loads(self.backend_template)
            }
        else:
            json_payload = {
                "template_id": self.template.id,
                "data": payload
            }
        response = requests.post(
            self.workflow_url,
            data=json.dumps(json_payload)
        )
        if not response.ok:
            raise Exception("Workflow failed")
        response = response.json()
        response = json.loads(response['message'])
        return response