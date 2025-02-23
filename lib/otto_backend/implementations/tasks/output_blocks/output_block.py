from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)

class OutputBlock(BaseImplementation):
    display_name = 'Output Block'
    block_type = 'output'
    block_metadata = BlockMetadata([])
    
    def __init__(self) -> None:
        super().__init__()
        self.final_output = {}
        
    def run(
        self, 
        output='',
        inbound_process_name:str=None,
        *args, **kwargs
    ):
        #self.final_output[inbound_process_name] = output
        return output