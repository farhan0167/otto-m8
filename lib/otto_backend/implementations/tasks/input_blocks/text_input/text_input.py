from core.types import InputType
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)

class TextInput(BaseImplementation):
    display_name = 'Text Input'
    block_type = 'input'
    block_metadata = BlockMetadata([
        Field(name="input_type", display_name="Input Type", is_run_config=True, default_value=InputType.TEXT.value),
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        
    
    def run(self, input_ = None):
        return input_