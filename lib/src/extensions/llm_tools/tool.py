from abc import ABC, abstractmethod

class Tool(ABC):
    def __init__(self) -> None:
        super().__init__()
        self.tool_schema = {
            "type": "function",
            "function": {
                "name": "",
                "description": "",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                }
            }
        }
    
    @abstractmethod
    def process_tool(self)->dict:
        pass