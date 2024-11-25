from implementations.base import BaseImplementation

class ChatOutputBlock(BaseImplementation):
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
        conversation[0] = {'role': 'user', 'content': user_input}
        self.chat_history.extend(conversation)
        return conversation[-1]