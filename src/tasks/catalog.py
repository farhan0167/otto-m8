from enum import Enum
# from tasks.huggingface_model_card import HuggingFaceModelCard
# from tasks.ocr_engine import OCREngine
# from tasks.output_block import OutputBlock

# class TaskCatalog(Enum):
#     hugging_face_model_card = HuggingFaceModelCard
#     ocr = OCREngine
#     output = OutputBlock

    
#     @staticmethod
#     def from_string(task_type: str):
#         try:
#             return TaskCatalog[task_type]
#         except KeyError:
#             raise ValueError(f"Task type {task_type} is not supported.")

class TaskCatalog(Enum):
    # key = module.file_name.class_name
    hugging_face_model_card = 'tasks.huggingface_model_card.HuggingFaceModelCard'
    ocr = 'tasks.ocr_engine.OCREngine'
    output = 'tasks.output_block.OutputBlock'

    def get_class(self):
        module_name, class_name = self.value.rsplit('.', 1)
        module = __import__(module_name, fromlist=[class_name])
        return getattr(module, class_name)
    
    def initialize(self, *args, **kwargs):
        # Get the class and initialize it
        cls = self.get_class()
        return cls(*args, **kwargs)

        
    @staticmethod
    def from_string(task_type: str):
        try:
            return TaskCatalog[task_type]
        except KeyError:
            raise ValueError(f"Task type {task_type} is not supported.")