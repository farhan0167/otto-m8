from abc import abstractmethod, ABC
from core.blocks import BlockMetadata


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
    
    @classmethod
    def get_block_config_sidebar_fields(cls):
        block_config_sidebar_fields = []
        for field in cls.block_metadata.fields:
            if field.is_run_config:
                block_config_sidebar_fields.append(field.__dict__)
        return block_config_sidebar_fields
    
    @abstractmethod
    def run(self):
        pass