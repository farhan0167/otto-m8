import json
import inspect
import ast

from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

from implementations import (
    TaskRegistry,
    TaskCatalog,
    IntegrationCatalog,
    IntegrationRegistry,
    CustomCatalog,
    CustomRegistry
)

router = APIRouter()

@router.get("/get_block_types", tags=["Blocks"])
def get_block_types():
    task_block_types = TaskRegistry.get_blocks_from_registry()
    integration_block_types = IntegrationRegistry.get_blocks_from_registry()
    custom_block_types = CustomRegistry.get_blocks_from_registry()
    block_types = {**task_block_types, **integration_block_types, **custom_block_types}
    # TODO: Standard Server Response: Implement a standard response template
    return block_types


@router.get("/get_integration_block_types", tags=["Blocks"])
def get_integration_block_types():
    integration_block_types = IntegrationRegistry.get_blocks_from_registry()
    # TODO: Standard Server Response: Implement a standard response template
    return integration_block_types

@router.get("/get_block_codes", tags=["Blocks"])
def get_source_code(core_block_type: str, process_type: str):
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
    
def insert_to_custom_catalog(
    block_file_name: str,
    block_code_path: str,
    block_code,
    core_block_type: str
):
    with open(block_code_path, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read(), filename=block_code_path)
    # Extract class names
    class_name = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)][-1]
    
    custom_catalog_path = "implementations/custom/catalog.py"
    with open(custom_catalog_path, "r") as f:
        custom_catalog_source = f.read()
        
    block_file_name_upper = block_file_name.upper().replace("-", "_")
    
    for line in custom_catalog_source.split("\n"):
        if "#### Start: Catalog for Custom Blocks ####" in line:
           # Add a new line below the line that contains "#### Start Insert Custom Tasks Here ####"
           newline = f"\n    {core_block_type.upper()} = 'implementations.custom.blocks.{block_file_name}.{class_name}'"
           custom_catalog_source = custom_catalog_source.replace(line, line + newline)
        
        if "CustomRegistry.add_vendor(vendor)" in line:
            newline = f"""\nCustomRegistry.add_block_to_registry_by_vendor(
            vendor="Custom Blocks",
            display_name="{block_file_name} - {class_name}",
            task=CustomCatalog.{core_block_type.upper()},
            ui_block_type="process",
            source_path="implementations/custom/blocks/{block_file_name}/{class_name}.py"
)
        """
            custom_catalog_source = custom_catalog_source.replace(line, line + newline)
    with open(custom_catalog_path, "w") as f:
        f.write(custom_catalog_source)
        

@router.post("/save_block_code", tags=["Blocks"])
def save_source_code(request: SaveBlockCodeRequest):
    with open(request.source_path, 'w') as f:
        f.write(request.source_code)
    
    insert_to_custom_catalog(
        block_file_name=request.file_name,
        block_code_path=request.source_path,
        block_code=request.source_code,
        core_block_type=request.core_block_type
    )
    return Response(status_code=200, content=json.dumps({"message": "Source code saved successfully."}))