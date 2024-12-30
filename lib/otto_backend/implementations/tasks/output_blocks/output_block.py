from implementations.base import BaseImplementation

class OutputBlock(BaseImplementation):
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