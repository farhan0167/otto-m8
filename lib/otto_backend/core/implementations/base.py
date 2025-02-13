from abc import abstractmethod, ABC
from typing import List, Union, Any
from pydantic import BaseModel

class Field(BaseModel):
    name: str
    display_name: Union[str, None]
    default_value: Any = ''
    type:str = 'text'
    is_run_config: bool = True
    show_in_ui: bool = True

class BlockMetadata:
    def __init__(self, fields:List[Field]) -> None:
        default_fields = [
            Field(name="custom_name", display_name="Block Name", is_run_config=False),
            Field(name="source_code", display_name="View Code", is_run_config=False, show_in_ui=False),
            Field(name="source_path", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="source_hash", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="process_type", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="core_block_type", display_name=None, show_in_ui=False),
        ]
        self.fields = [*default_fields, *fields]

class BaseImplementation(ABC):
    """Base class for all implementations. An implementation is a class that implements a
    library(third party integrations) for a Block."""
    display_name: str = ""
    block_type: str = 'base'
    block_metadata: BlockMetadata = BlockMetadata([])
    
    @classmethod
    def get_run_config(cls):
        run_config = {}
        for field in cls.block_metadata.fields:
            if field.is_run_config:
                run_config[field.name] = field.default_value
        return run_config
        
    @classmethod
    def get_block_ui(cls):
        block_ui_fields = []
        for field in cls.block_metadata.fields:
            if field.show_in_ui:
                block_ui_fields.append(field.name)
        return block_ui_fields
    
    @classmethod
    def get_frontend_block_data(cls):
        initial_data = {
            'id': '',
            'position': {'x': 500, 'y': 100},
            'data': {'label': ''},
            'type': cls.block_type
        }
        
        for field in cls.block_metadata.fields:
            initial_data['data'][field.name] = field.default_value
        return initial_data
    
    @abstractmethod
    def run(self):
        pass