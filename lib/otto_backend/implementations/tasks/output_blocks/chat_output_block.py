from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)

class ChatOutputBlock(BaseImplementation):
    display_name = 'Chat Output'
    block_type = 'output'
    block_metadata = BlockMetadata([])
    
    def __init__(self) -> None:
        super().__init__()
        self.chat_history = []
        
    def run(
        self, output='', 
        inbound_process_name:str=None,
        *args, 
        **kwargs
    ):
        user_input = kwargs.get('user_input')
        conversation = output['conversation']
        # Since this is a chat output block, we need to add the user input to the conversation
        # and not the input the last block received.
        conversation[0] = {'role': 'user', 'content': user_input.get('Input_Block')}
        self.chat_history.extend(conversation)
        return conversation[-1]