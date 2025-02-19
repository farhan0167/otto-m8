import json
import inspect
import os
from collections import defaultdict

from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from core.implementations.registry import BlockRegistry, BlockRegistryUtils
from implementations import (
    TaskCatalog,
    IntegrationCatalog,
    CustomCatalog,
)

router = APIRouter()

@router.get("/get_block_types", tags=["Blocks"])
async def get_block_types():
    block_types = BlockRegistry.get_blocks_from_registry()
    # TODO: Standard Server Response: Implement a standard response template
    return block_types

@router.get("/get_block_initial_data", tags=["Blocks"])
async def get_block_initial_data(
    core_block_type: str, 
    process_type: str
):
    core_block_type = core_block_type.upper()
    if process_type == 'task':
        cls = TaskCatalog[core_block_type]
    elif process_type == 'integration':
        cls = IntegrationCatalog[core_block_type]
    elif process_type == 'custom':
        cls = CustomCatalog[core_block_type]
    else:
        raise ValueError(f"Core block type {core_block_type} is not supported.")
    
    cls = cls.get_class()
    initial_data = cls.get_frontend_block_data()
    sidebar_fields = cls.get_block_config_sidebar_fields()
    block_ui_fields = cls.get_block_config_ui_fields()

    initial_data['data']['sidebar_fields'] = sidebar_fields
    initial_data['data']['block_ui_fields'] = block_ui_fields

    return Response(status_code=200, content=json.dumps({
        **initial_data
    }))


@router.get("/get_integration_block_types", tags=["Blocks"])
async def get_integration_block_types():
    block_types = BlockRegistry.get_blocks_from_registry()
    integration_block_types = defaultdict(dict)
    for vendor, block in block_types.items():
        for display_name, block_metadata in block.items():
            if block_metadata['process_type'] == 'integration':
                integration_block_types[vendor][display_name] = block_metadata

    # TODO: Standard Server Response: Implement a standard response template
    return dict(integration_block_types)

@router.get("/get_block_codes", tags=["Blocks"])
async def get_source_code(core_block_type: str, process_type: str):
    core_block_type = core_block_type.upper()

    if process_type == 'task':
        cls = TaskCatalog[core_block_type]
    elif process_type == 'integration':
        cls = IntegrationCatalog[core_block_type]
    elif process_type == 'custom':
        cls = CustomCatalog[core_block_type]
    else:
        raise ValueError(f"Core block type {core_block_type} is not supported.")
    
    cls = cls.get_class()
    source_path = inspect.getfile(cls)
    with open(source_path, 'r') as f:
        source_code = f.read()
    return {
        "source_code": source_code,
        "source_path": source_path
    }
    
class SaveBlockCodeRequest(BaseModel):
    source_code: str
    source_path: str
    file_name: str
    core_block_type: str
    reference_core_block_type: str
        

@router.post("/save_block_code", tags=["Blocks"])
async def save_source_code(request: SaveBlockCodeRequest):
    with open(request.source_path, 'w') as f:
        f.write(request.source_code)
    
    new_core_block_type = BlockRegistryUtils.insert_to_custom_catalog(
        block_file_name=request.file_name,
        block_code_path=request.source_path,
        block_code=request.source_code,
        core_block_type=request.core_block_type,
        reference_core_block_type=request.reference_core_block_type
    )
    return Response(status_code=200, content=json.dumps(
        {
            "new_core_block_type": new_core_block_type, 
            "message": "Source code saved successfully."
        })
    )


@router.delete("/delete_block_type", tags=["Blocks"])
async def delete_block_type(custom_block: dict):
    print(custom_block)
    block_metadata = custom_block['block_metadata']
    file_to_delete = block_metadata['source_path']
    vendor_name = custom_block['vendor_name']
    display_name = custom_block['display_name']
    
    os.remove(f"./{file_to_delete}")
    custom_catalog_path = "implementations/custom/catalog.py"
    BlockRegistryUtils.remove_enum_and_registry_calls(
        file_path=custom_catalog_path,
        enum_key=block_metadata['core_block_type'].upper()
    )
    BlockRegistry.remove_block_from_registry_by_vendor(vendor_name, display_name)
    return Response(status_code=200, content=json.dumps({"message": "Block type deleted successfully."}))
    