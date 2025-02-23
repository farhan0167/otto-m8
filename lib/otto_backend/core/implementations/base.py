from abc import abstractmethod, ABC
from core.blocks import BlockMetadata, MultimodalField


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
    def get_block_config_ui_fields(cls):
        """Return the fields that are visible in the block's UI."""
        block_ui_fields = []
        for field in cls.block_metadata.fields:
            if field.show_in_ui:
                block_ui_fields.append(field.__dict__)
        return block_ui_fields
    
    @classmethod
    def get_frontend_block_data(cls):
        """Return the initial data for a block."""
        position_map = {
            "input": {"x": 300, "y": 150},
            "output": {"x": 700, "y": 150},
            "process": {"x": 500, "y": 150}
        }
        initial_data = {
            'id': '',
            'position': position_map[cls.block_type],
            'data': {'label': '', 'sidebar_fields': [], 'block_ui_fields': []},
            'type': cls.block_type
        }
        
        for field in cls.block_metadata.fields:
            if isinstance(field, MultimodalField):
                image = field.image
                text = field.text
                initial_data['data'][image.name] = image.default_value
                initial_data['data'][text.name] = text.default_value
                continue
            initial_data['data'][field.name] = field.default_value
        return initial_data
    
    @classmethod
    def get_block_config_sidebar_fields(cls):
        """Return the fields that are visible in the block's configuration sidebar."""
        block_config_sidebar_fields = []
        for field in cls.block_metadata.fields:
            if field.is_run_config:
                if isinstance(field, MultimodalField):
                    block_config_sidebar_fields.append(field.__dict__())
                    continue
                block_config_sidebar_fields.append(field.__dict__)
        return block_config_sidebar_fields
    
    @abstractmethod
    def run(self):
        pass