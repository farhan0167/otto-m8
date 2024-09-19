from tasks.task import Task

class HuggingFaceModelCard(Task):
    def __init__(self) -> None:
        super().__init__()
        
    
    def run(self, input_=None, run_config:dict=None):
        model_card = run_config.get('model_card', None)
        self.model_card = model_card
        return f"Running Hugging Face Model: {self.model_card} with input={input_}"