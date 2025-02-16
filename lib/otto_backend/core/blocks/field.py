from enum import Enum
from typing import List, Union, Any
from pydantic import BaseModel

class FieldType(Enum):
    TEXT = 'text'
    TEXTAREA = 'textarea'
    TOOL_LIST = 'tool_list'
    PROMPT_TEMPLATE = 'prompt_template'

class Field(BaseModel):
    name: str
    display_name: Union[str, None] = None
    default_value: Any = ''
    type:str = FieldType.TEXT.value
    is_run_config: bool = True
    show_in_ui: bool = True