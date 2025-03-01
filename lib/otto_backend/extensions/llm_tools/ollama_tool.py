from extensions.llm_tools.tool import Tool
from implementations.integrations.implementer import IntegrationImplementer
from implementations.custom.implementer import CustomBlockImplementer

class OllamaTool(Tool):
    def __init__(self) -> None:
        super().__init__()
        self.implements = None
    
    def process_tool(self, tool):
        self.tool_schema['function']['name'] = tool['name']
        self.tool_schema['function']['description'] = tool['description']
        for param in tool['params']:
            self.tool_schema['function']['parameters']['properties'][ param['name'] ] = {
                "type": param.get('type', 'string'),
                "description": param['description'],
            }
            if param.get('required', True):
                self.tool_schema['function']['parameters']['required'].append(param['name'])
        
        if tool.get('integrated_with') is not None:
            tool_integration = tool['integrated_with']
            # TODO Issue #82: Clean this up when solving the issue
            try:
                self.implements = CustomBlockImplementer().create_task(
                    task_type=tool_integration['core_block_type'],
                    run_config=tool_integration['run_config']
                )
            except Exception as e:
                self.implements = IntegrationImplementer().create_integration(
                    integration_type=tool_integration['core_block_type'],
                    run_config=tool_integration['run_config']
                )
        return self.tool_schema