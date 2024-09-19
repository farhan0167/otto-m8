from tasks.task import Task
print("Im being loaded")
class OCREngine(Task):
    def __init__(self) -> None:
        super().__init__()
        
    
    def run(self, input_ = None, run_config:dict=None):
        model_card = run_config.get('imports', None)
        self.model_card = model_card
        return f"Running OCR Engine: {self.model_card}"