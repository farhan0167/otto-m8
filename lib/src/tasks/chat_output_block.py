from tasks.task import Task

class ChatOutputBlock(Task):
    def __init__(self) -> None:
        super().__init__()
        self.chat_history = []
        
    def run(self, output='', inbound_process_name:str=None):
        conversation = output['conversation']
        self.chat_history.extend(conversation)
        return conversation[-1]