from typing import List
from core.blocks.field import Field

class BlockMetadata:
    """BlockMetadata groups together the fields of a block. This helps an Implementation
    class to define the fields that are visible in the block's UI,
    the fields that are visible in the block's sidebar, and generating the initial
    state of the Block(Reactflow nodes).
    """
    def __init__(self, fields:List[Field]) -> None:
        default_fields = [
            Field(name="custom_name", display_name="Block Name"),
            Field(name="source_code", display_name="View Code", is_run_config=False, show_in_ui=False),
            Field(name="source_path", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="source_hash", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="process_type", display_name=None, is_run_config=False, show_in_ui=False),
            Field(name="core_block_type", display_name=None, is_run_config=False, show_in_ui=False),
        ]
        """Default fields that are common across all blocks"""
        
        self.fields = [*default_fields, *fields]