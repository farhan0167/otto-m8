from typing import List
from core.blocks.field import Field

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