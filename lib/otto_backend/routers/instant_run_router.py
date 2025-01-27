import json
import tempfile
import os
import shutil

import docker
from fastapi import APIRouter, Response, HTTPException
from pydantic import BaseModel

from implementations.tasks.implementer import Implementer
from implementations.integrations.implementer import IntegrationImplementer
from engine.workflow import RunWorkflow
from engine.blocks import WorkflowTemplate


router = APIRouter()

class InstantRunPayload(BaseModel):
    payload: str
    core_block_type: str
    process_type: str
    run_config: dict
    
class TestWorkflowPayload(BaseModel):
    backend_template: dict
    data: dict

@router.post("/instant_run", tags=["Instant Runs"])
def instant_run(request: InstantRunPayload):
    """
    Router for users to test instant runs. Should initialize
    an Implementer, and then run and return the results back.
    """
    run_config = request.run_config
    core_block_type = request.core_block_type
    process_type = request.process_type
    if process_type == 'task':
        process = Implementer().create_task(
            task_type=core_block_type, 
            run_config=run_config
        )
    elif process_type == 'integration':
        process = IntegrationImplementer().create_integration(
            integration_type=core_block_type, 
            run_config=run_config
        )
    else:
        raise ValueError(f"Core block type {core_block_type} is not supported")
    
    response = process.run(request.payload)
    return response

@router.post("/test_workflow", tags=["Instant Runs"])
def test_workflow(request: TestWorkflowPayload):

    backend_template = request.backend_template
    backend_template = {
        "workflow_name": "test_workflow",
        **backend_template
    }
    template = WorkflowTemplate(**backend_template)
    workflow = RunWorkflow(template)
    workflow.initialize_resources()
    
    try:
        payload = request.data
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    output = workflow.run_workflow(payload=payload)
    output = output['Output_Block']['block_output']
    output = json.dumps(output)   

    return {
            "message": output
    }