
from typing import Any


class BasicIntegrationInputParser:
    """ 
    Class to handle input parsing for integration block types.
    This parser should get the only input payload available, and
    enforces the idea that all integrations blocks can not have multiple
    process blocks sending it an input.
    """
    def __init__(self, input_:dict) -> None:
        self.input = input_   
        if len(self.input) > 1:
            raise Exception("Multiple input blocks found. Only one input block is allowed per integration block.")
    
    def __call__(self, *args: Any, **kwds: Any) -> Any:
        """When called, return the first item in the input dict"""
        return list(self.input.values())[0]