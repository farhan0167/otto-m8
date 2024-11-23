from typing import Any

class PromptTemplate:
    """ 
    Class to handle the input parsing for creating chat based
    prompt templates.
    """
    def __init__(
        self,
        input_:dict,
        template:str
    ) -> None:
        self.input = input_
        self.template = template
    
    def __call__(self, *args: Any, **kwds: Any) -> Any:
        return f'{self.template}'.format(**self.input)
    