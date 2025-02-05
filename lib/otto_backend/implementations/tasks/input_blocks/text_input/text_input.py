from implementations.base import BaseImplementation

class TextInput(BaseImplementation):
    display_name = 'Text Input'
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        
    
    def run(self, input_ = None):
        return input_