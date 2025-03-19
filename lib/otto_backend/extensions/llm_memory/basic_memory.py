import json
from .base import BaseMemory

class BasicMemory(BaseMemory):
    """
    The Basic Memory is a simple memory that stores the chat history in a list
    as is. This kind of memory preserves the entire chat history. However, it
    suffers from the disadvantage that if the history gets too long, it might
    hit the limits of the LLM's context window.
    """
    def __init__(self, block_uuid:str) -> None:
        super().__init__(block_uuid)
        
    def put(self, messages:list):
        if messages:
            if messages[0]['role'] == 'system':
                messages = messages[1:]
            self.redis_client.hset(
                self.redis_key,
                mapping={
                    'messages': json.dumps(messages)
                }
            )
    
    def get(self, user_prompt:dict=None):
        if user_prompt['content'] in ["<otto_reset_memory>", "<reset_memory>", "<clear_memory>"]:
            self.delete_all()
            user_prompt['content'] = ""
        history = []
        history = self.redis_client.hgetall(self.redis_key)
        history = history.get('messages', [])
        if history:
            history = json.loads(history)
        return history + [user_prompt]
        
    