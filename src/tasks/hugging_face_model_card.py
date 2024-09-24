from transformers import (
    # AutoTokenizer,
    # AutoModelForSequenceClassification,
    pipeline
)
from tasks.task import Task
from utils.hugging_face.hugging_face_api import HuggingFaceApi


class HuggingFaceModelCard(Task):
    def __init__(self, run_config:dict) -> None:
        self.run_config = run_config
        self.model_card = run_config.get('model_card')
        self.get_huggingface_pipeline_config()
        # self.tokenizer = AutoTokenizer.from_pretrained(self.model_card)
        # self.model = AutoModelForSequenceClassification.from_pretrained(self.model_card, num_labels=3)
        self.pipeline = pipeline(self.pipeline_tag, model=self.model_card)
        
    
    def run(self, input_=None):
        results = self.pipeline(input_)
        return results
    
    def get_huggingface_pipeline_config(self):
        models = HuggingFaceApi.search_model(self.model_card)
        for model in models:
            if model.modelId == self.model_card:
                self.pipeline_tag = model.pipeline_tag
                return
            else:
                raise Exception(f"Model card {self.model_card} not found")