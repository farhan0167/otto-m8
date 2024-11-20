import json
import tempfile
import os
import shutil

import docker
from fastapi import APIRouter
from pydantic import BaseModel

from tasks.implementer import Implementer
from integrations.implementer import IntegrationImplementer


router = APIRouter()

class InstantRunPayload(BaseModel):
    payload: str
    core_block_type: str
    process_type: str
    run_config: dict

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