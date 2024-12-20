

class HuggingFaceMultimodalInputParser:
    def __init__(self, input_: dict, run_config: dict) -> None:
        self.input = input_
        self.image_variable = run_config.get('image_input')
        self.text_variable = run_config.get('text_input')
    
    def __call__(self):
        image = self.input.get(self.image_variable)
        text = self.input.get(self.text_variable)
        return image, text