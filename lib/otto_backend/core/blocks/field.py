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
    
class StaticDropdownOption(BaseModel):
    value: str
    label: str
    
    def __dict__(self):
        return {
            'value': self.value,
            'label': self.label
        }

class Field(BaseModel):
    name: str
    display_name: Union[str, None] = None
    default_value: Any = ''
    type:str = FieldType.TEXT.value
    dropdown_options: List[Dict] = []
    is_run_config: bool = True
    show_in_ui: bool = True
    
    
    
    
    
    
    
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