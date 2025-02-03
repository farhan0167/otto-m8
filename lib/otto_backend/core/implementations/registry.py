from typing import Dict
from enum import Enum
from pydantic import BaseModel


class BlockRegistry:
    vendors = {}
    process_type = ""
    
    @classmethod
    def add_vendor(cls, vendor: str):
        if vendor not in cls.vendors:
            cls.vendors[vendor] = {}
    
    @classmethod
    def add_block_to_registry_by_vendor(
        cls, 
        vendor: str, 
        display_name: str, 
        task: Enum,
        ui_block_type: str,
        source_path: str
    ):
        if vendor not in cls.vendors:
            raise Exception(f"Vendor {vendor} is not supported.")
        cls.vendors[vendor][display_name] = {
            'core_block_type': task.name.lower(),
            'process_type': cls.process_type,
            'ui_block_type': ui_block_type,
            'source_path': source_path
        }
    
    @classmethod
    def get_blocks_from_registry(cls):
        return cls.vendors