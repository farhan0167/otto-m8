import json
import inspect

from fastapi import APIRouter, HTTPException

from implementations import (
    TaskRegistry,
    TaskCatalog,
    IntegrationCatalog,
    IntegrationRegistry
)

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

@router.get("/get_block_codes", tags=["Blocks"])
def get_source_code(core_block_type: str):
    core_block_type = core_block_type.upper()
    try:
        cls = TaskCatalog[core_block_type]
    except:
        try:
            cls = IntegrationCatalog[core_block_type]
        except:
            #raise ValueError(f"Core block type {core_block_type} is not supported.")
            return HTTPException(status_code=404, detail=f"Core block type {core_block_type} is not supported.")
    
    cls = cls.get_class()
    source_path = inspect.getfile(cls)
    with open(source_path, 'r') as f:
        source_code = f.read()
    return source_code