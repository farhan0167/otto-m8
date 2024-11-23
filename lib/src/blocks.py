from typing import List, Union
from pydantic import BaseModel, ValidationError, Field, field_validator, model_validator
from implementations.base import BaseImplementation

class Block(BaseModel, extra = 'forbid', arbitrary_types_allowed = True):
    name: str
    block_type: str = 'simple_block'
    connections: list[str] = Field(description="List of connections to other blocks in the model", default=[])
    run_config: dict = Field(description="Configuration for the run", default=None)
    implementation: Union[BaseImplementation, None] = Field(description="The implementation of the block", default=None)
    
    @field_validator('block_type', mode='before')
    @classmethod
    def validate_block_type(cls, v):
        """
        Ensures that block_type is equal to the lowercase version of the name of the class.
        
        This is useful for ensuring that the block_type of a model is consistent with its class name.
        """
        if cls.__name__.lower().startswith(v):
            return v
        raise ValueError(f"{cls.__name__} must have block_type '{cls.__name__.lower()}'")

class InputBlock(Block):
    custom_name: str = 'user_input'
    block_type: str = 'input'
    payload: Union[str, None] = None
    # The input type of the block determines the type of the input in the run config that will be passed to a model.
    input_type: str = 'text'
    
class OutputBlock(Block):
    block_type: str = 'output'
    
class ProcessBlock(Block):
    custom_name: str
    block_type: str = 'process'
    process_metadata: dict = {}

class WorkflowTemplate(BaseModel, extra='forbid'):
    workflow_name: str
    input: List[InputBlock]
    process: List[ProcessBlock]
    output: List[OutputBlock]
    version: float = 1.0
    
    @model_validator(mode='before')
    @classmethod
    def validate_connections(cls, values):
        """
        Validate that all connections in the model reference valid block names.
        
        The connections are validated by checking that each connection is in the set of all block names.
        If a connection is not in the set of block names, a ValueError is raised.
        """
        all_block_names = {
            f"input.{block['name']}" for block in values.get('input', [])
        }.union({
            f"output.{block['name']}" for block in values.get('output', [])
        }).union({
            f"process.{block['name']}" for block in values.get('process', [])
        })

        # Validate that connections reference valid block names
        for block_list in ['input', 'output', 'process']:
            for block in values.get(block_list, []):
                for connection in block.get('connections', []):
                    if connection not in all_block_names:
                        raise ValueError(f"Block '{block_list}.{block['name']}' has an invalid connection to '{connection}'")
        return values
