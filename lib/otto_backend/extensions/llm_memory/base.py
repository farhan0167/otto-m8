from core.connections import redis_client

class BaseMemory:
    """ 
    Base class for chat memory. On the most basic level, a memory object
    has get and put operations. It can get chat history and put new chat history.
    """
    def __init__(self, block_uuid:str) -> None:
        self.redis_key = f"chat_memory:{block_uuid}"
        self.redis_client = redis_client
    
    def put(self, messages:list):
        """
        Stores a list of messages in the chat memory. If a message with the role 'system'
        is present at the beginning of the list, it will be ignored. The messages are
        stored in the Redis database under the key associated with this memory instance.

        Args:
            messages (list): A list of message dictionaries to be stored.
        """
        return
    
    def get(self, user_prompt:dict=None):
        """
        Retrieves the chat history and possibly appends the user's prompt message to
        the end of the history. If the user's prompt is None, the history will not be
        modified.

        Args:
            user_prompt (dict): The user's prompt message to be appended to the chat history.

        Returns:
            list: The chat history with the user's prompt message possibly appended.
        """
        return [user_prompt]
    
    def delete_all(self):
        """
        Deletes all messages stored in the chat memory for this memory instance.

        Note that this is a destructive operation and cannot be undone.
        """
        self.redis_client.hdel(self.redis_key, 'messages')