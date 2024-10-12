from utils.llm_tools.tool import Tool
from integrations.implementer import IntegrationImplementer

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
            self.tool_schema['function']['parameters']['required'].append(param['name'])
        
        if tool.get('integrated_with') is not None:
            tool_integration = tool['integrated_with']
            self.implements = IntegrationImplementer().create_integration(
                integration_type=tool_integration['core_block_type'],
                run_config=tool_integration['run_config']
            )
        return self.tool_schema