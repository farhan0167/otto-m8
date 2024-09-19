from tasks.task import Task

class OutputBlock(Task):
    def __init__(self) -> None:
        super().__init__()
        self.final_output = {}
        
    def run(self, output='', inbound_process_name:str=None):
        self.final_output[inbound_process_name] = output