from .types import LLMChatMemoryType
from .base import BaseMemory

class ChatMemory:
    
    def initialize(
        self, 
        block_uuid: str,
        memory_type: str = LLMChatMemoryType.BASIC_MEMORY.value,
    ) -> BaseMemory:
        if not memory_type:
            pass
        if memory_type == LLMChatMemoryType.BASIC_MEMORY.value:
            pass
