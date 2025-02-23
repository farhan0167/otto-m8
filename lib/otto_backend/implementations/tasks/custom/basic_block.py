import json
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)

class CustomBlock(BaseImplementation):
    display_name = "Custom Block"
    block_type = 'process'
    block_metadata = BlockMetadata([])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        
    def run(self, input_:dict=None):
        return input_