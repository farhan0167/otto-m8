from typing import List, Union, Any
from pydantic import BaseModel

class FieldType:
    TEXT = 'text'

class Field(BaseModel):
    name: str
    display_name: Union[str, None]
    default_value: Any = ''
    type:str = "text"
    is_run_config: bool = True
    show_in_ui: bool = True