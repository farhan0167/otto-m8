from enum import Enum
from typing import List, Union, Any, Dict
from pydantic import BaseModel
import requests

class FieldType(Enum):
    TEXT = 'text'
    TEXTAREA = 'textarea'
    STATIC_DROPDOWN = 'static_dropdown'
    LAMBDAS_DROPDOWN = 'lambdas_dropdown'
    TOOL_LIST = 'tool_list'
    PROMPT_TEMPLATE = 'prompt_template'
    MULTIMODAL_SELECTOR = 'multimodal_selector'
    
class StaticDropdownOption(BaseModel):
    """Object to represent a dropdown option for a static dropdown."""
    value: str
    label: str
    
    def __dict__(self):
        return {
            'value': self.value,
            'label': self.label
        }

class Field(BaseModel):
    """Base representation of a field in a block. These are used by
    users to configure a block or see the block's configuration in the block.
    """
    name: str
    display_name: Union[str, None] = None
    default_value: Any = ''
    type:str = FieldType.TEXT.value
    dropdown_options: List[Dict] = []
    is_run_config: bool = True
    show_in_ui: bool = True
    
class MultimodalField:
    """Object to represent a field for a multimodal selector."""
    def __init__(
        self,
        image:Field,
        text:Field,
        name: Union[str, None] = None,
        display_name: Union[str, None] = None,
        is_run_config: bool = True,
        show_in_ui: bool = False
    ) -> None:
        self.name = name
        self.display_name = display_name
        self.image = image
        self.text = text
        self.type = FieldType.MULTIMODAL_SELECTOR.value
        self.show_in_ui = show_in_ui
        self.is_run_config = is_run_config
        
    def __dict__(self):
        result = {
            'name': self.name,
            'display_name': self.display_name,
            'type': self.type,
            'image': self.image.__dict__,
            'text': self.text.__dict__,
            'is_run_config': self.is_run_config,
            'show_in_ui': self.show_in_ui,
        }
        
        return result
    
    
    
    
    
    
    
# class DynamicDropdownOptions:
#     def __init__(self, endpoint=None, method='GET'):
#         self.endpoint = endpoint
#         self.method = method
#         self.options = []
        
#     def get_options(self):
#         try:
#             print(self.endpoint)
#             if self.method == 'GET' and self.endpoint:
#                 response = requests.get(
#                     self.endpoint,
#                     timeout=10
#                 )
#                 response = response.json()
#                 print(response)
#                 self.options = [
#                     StaticDropdownOption(value=option['name'], label=option['name']).__dict__ for option in response
#                 ]
#         except Exception as e:
#             print(e)
            
#         return self.options