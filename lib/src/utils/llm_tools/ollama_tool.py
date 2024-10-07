from utils.llm_tools.tool import Tool

class OllamaTool(Tool):
    
    def process_tool(self, tool):
        self.tool_schema['function']['name'] = tool['name']
        self.tool_schema['function']['description'] = tool['description']
        for param in tool['params']:
            self.tool_schema['function']['parameters']['properties'][ param['name'] ] = {
                "type": param.get('type', 'string'),
                "description": param['description'],
            }
            self.tool_schema['function']['parameters']['required'].append(param['name'])
        return self.tool_schema