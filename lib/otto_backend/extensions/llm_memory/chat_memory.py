from .types import LLMChatMemoryType
from .base import BaseMemory
from .basic_memory import BasicMemory

class ChatMemory:
    """Factory class for chat memory implementations."""
    
    def initialize(
        self, 
        block_uuid: str,
        memory_type: str = LLMChatMemoryType.BASIC_MEMORY.value,
    ) -> BaseMemory:
        """
        Factory method to initialize a chat memory object.
        
        Args:
            block_uuid (str): The UUID of the block.
            memory_type (str): The type of memory to initialize. Defaults to basic_memory.
        
        Returns:
            BaseMemory: The chat memory object.
        """
        if not memory_type:
            return BaseMemory(block_uuid)
        if memory_type == LLMChatMemoryType.BASIC_MEMORY.value:
            return BasicMemory(block_uuid)
