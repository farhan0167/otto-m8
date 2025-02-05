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
        source_path: str,
        reference_core_block_type: str = None
    ):
        if vendor not in cls.vendors:
            raise Exception(f"Vendor {vendor} is not supported.")
        block_cls = task.get_class()
        display_name = block_cls.display_name
        
        if not reference_core_block_type:
            # only custom blocks will have a reference. If not found, then its a regular block.
            reference_core_block_type=task.name.lower()
        cls.vendors[vendor][display_name] = {
            'core_block_type': task.name.lower(),
            'process_type': cls.process_type,
            'ui_block_type': ui_block_type,
            'source_path': source_path,
            'reference_core_block_type': reference_core_block_type
        }
        
    @classmethod
    def remove_block_from_registry_by_vendor(cls, vendor: str, display_name: str):
        if vendor in cls.vendors and display_name in cls.vendors[vendor]:
            del cls.vendors[vendor][display_name]
    
    @classmethod
    def get_blocks_from_registry(cls):
        return cls.vendors