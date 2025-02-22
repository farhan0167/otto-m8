import re
import ast
from enum import Enum


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
        task: Enum,
        ui_block_type: str,
        source_path: str,
        reference_core_block_type: str = None
    ):
        if vendor not in cls.vendors:
            raise Exception(f"Vendor {vendor} is not supported.")
        try:
            block_cls = task.get_class()
        except Exception as e:
            print("Error getting class:", e)
            block_cls = None
        display_name = block_cls.display_name if block_cls else task.name
        
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
    
class BlockRegistryUtils:
    
    @staticmethod
    def insert_to_custom_catalog(
        block_file_name: str,
        block_code_path: str,
        block_code,
        core_block_type: str,
        reference_core_block_type: str
    ):
        with open(block_code_path, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=block_code_path)
        # Extract class names
        class_name = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)][-1]
        
        custom_catalog_path = "implementations/custom/catalog.py"
        with open(custom_catalog_path, "r") as f:
            custom_catalog_source = f.read()
        
        block_file_name = block_file_name.split(".")[0] # need error handling here.
        block_file_name_upper = block_file_name.upper().replace("-", "_")
        
        # Regex to check if the Enum key already exists
        enum_pattern = re.compile(rf"^\s*{block_file_name_upper}\s*=\s*['\"].*['\"]", re.MULTILINE)
        
        if enum_pattern.search(custom_catalog_source):
            print(f"Enum key '{block_file_name_upper}' already exists in {custom_catalog_path}. Removing...")
            BlockRegistryUtils.remove_enum_and_registry_calls(
                file_path=custom_catalog_path,
                enum_key=block_file_name_upper
            )
            # re-read the catalog file with the old enum key removed
            with open(custom_catalog_path, "r") as f:
                custom_catalog_source = f.read()
        
        for line in custom_catalog_source.split("\n"):
            if "#### Start: Catalog for Custom Blocks ####" in line:
                # Add a new line below the line that contains "#### Start Insert Custom Tasks Here ####"
                newline = f"\n    {block_file_name_upper} = 'implementations.custom.blocks.{block_file_name}.{class_name}'"
                custom_catalog_source = custom_catalog_source.replace(line, line + newline)
                
            if "CustomRegistry.add_vendor(vendor)" in line:
                    newline = f"""\ntry:
    CustomRegistry.add_block_to_registry_by_vendor(
                    vendor="Custom Blocks",
                    task=CustomCatalog.{block_file_name_upper},
                    ui_block_type="process",
                    source_path="implementations/custom/blocks/{block_file_name}.py",
                    reference_core_block_type="{reference_core_block_type}"
)
except Exception as e:
    print(f"Error adding block to registry ", e)
                """
                    custom_catalog_source = custom_catalog_source.replace(line, line + newline)
        with open(custom_catalog_path, "w") as f:
            f.write(custom_catalog_source)
            
        return block_file_name_upper.lower()
    
    
    @staticmethod
    def remove_enum_and_registry_calls(file_path, enum_key):
        with open(file_path, 'r') as file:
            content = file.read()

        # Step 1: Remove the Enum line
        enum_pattern = re.compile(rf"^\s*{re.escape(enum_key)}\s*=.*\n?", re.MULTILINE)
        content = enum_pattern.sub("", content)  # Remove the Enum line and its trailing newline

        # Step 2: Remove ONLY the `CustomRegistry.add_block_to_registry_by_vendor(...)` call that references the specific Enum
        registry_pattern = re.compile(
            rf"^\s*try:\s*\n"  # Start of the try block
            rf"(?:\s+.*\n)*?"  # Match any lines before the function call
            rf"\s*CustomRegistry\.add_block_to_registry_by_vendor\(\s*\n"  # Function call start
            rf"(?:\s+.*\n)*?"  # Match any lines before `task=`
            rf"\s+task=CustomCatalog\.{re.escape(enum_key)},\s*\n"  # Ensure `task=` matches the specific Enum
            rf"(?:\s+.*\n)*?"  # Match any lines after `task=`
            rf"\s*\)\s*\n"  # Ensure the function call ends correctly
            rf"(?:\s+.*\n)*?"  # Match any lines after the function call
            rf"\s*except Exception as e:\s*\n"  # Match the except block
            rf"\s*print\(f\"Error adding block to registry \", e\)\s*\n*",  # Match the print statement in the except block
            re.MULTILINE
        )

        content = registry_pattern.sub("", content)  # Remove only the targeted function call

        # Write back the modified content
        with open(file_path, 'w') as file:
            file.write(content)