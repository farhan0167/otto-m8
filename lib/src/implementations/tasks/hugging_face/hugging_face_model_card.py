import io
import json
from PIL import Image
from transformers import (
    pipeline
)
from implementations.base import BaseImplementation
from integrations.hugging_face.hugging_face_api import HuggingFaceApi


class HuggingFaceModelCard(BaseImplementation):
    def __init__(self, run_config:dict) -> None:
        self.run_config = run_config
        self.model_card = run_config.get('model_card')
        self.input_type = run_config.get('input_type')
        self.get_huggingface_pipeline_config()
        self.pipeline = pipeline(self.pipeline_tag, model=self.model_card)
        
    
    def run(self, input_:dict=None) ->dict:
        input_ = input_.get('user_input')
        
        if self.input_type == 'text':
            results = self.pipeline(input_)
        elif self.input_type == 'image':
            input_ = self.preprocess_image_input(input_)
            results = self.pipeline(input_)
        else:
            raise Exception(f"Input type {self.input_type} not supported")
        # TODO Post Processing: Perhaps everything should have its own post processing logic.
        try:
            if not isinstance(results, dict):
                # If not dict, convert it into one.
                results = {'output': results}
            results = json.loads(json.dumps(results))
        except:
            for process_name, process_outputs in results.items():
                for i, process_output in enumerate(process_outputs):
                    for key, value in process_output.items():
                        if not (isinstance(value, str) or isinstance(value, int) or isinstance(value, float)):
                            results[process_name][i][key] = str(value)
            results = json.loads(json.dumps(results))
        # Check if we need to pass the input to the output
        pass_input_to_output = self.run_config.get('pass_input_to_output', False)
        if pass_input_to_output:
            results['input'] = input_
        return results
    
    def get_huggingface_pipeline_config(self):
        models = HuggingFaceApi.search_model(self.model_card)
        for model in models:
            if model.modelId == self.model_card:
                self.pipeline_tag = model.pipeline_tag
                return
            else:
                raise Exception(f"Model card {self.model_card} not found")
    
    def preprocess_image_input(self, input_):
        """Preprocess the image input into PIL Image object"""
        image_stream = io.BytesIO(input_)
        pil_image = Image.open(image_stream)
        return pil_image