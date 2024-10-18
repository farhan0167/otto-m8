import json

from fastapi import APIRouter

from tasks.catalog import TaskRegistry
from integrations.catalog import IntegrationRegistry

router = APIRouter()

@router.get("/get_block_types", tags=["Blocks"])
def get_block_types():
    task_block_types = TaskRegistry.get_task_registry()
    integration_block_types = IntegrationRegistry.get_integration_registry()
    block_types = {**task_block_types, **integration_block_types}
    # TODO: Standard Server Response: Implement a standard response template
    return block_types


@router.get("/get_integration_block_types", tags=["Blocks"])
def get_integration_block_types():
    integration_block_types = IntegrationRegistry.get_integration_registry()
    # TODO: Standard Server Response: Implement a standard response template
    return integration_block_types