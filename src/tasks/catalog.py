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
    #### Catalog for Tasks ####
    # key = module.file_name.class_name
    hugging_face_model_card = 'tasks.hugging_face_model_card.HuggingFaceModelCard'
    ocr = 'tasks.ocr_engine.OCREngine'
    output = 'tasks.output_block.OutputBlock'
    #### Catalog for Tasks ####

    def get_class(self):
        """
        Return the class instance associated with this Enum value.

        Given a full path to a class, this method will return the class instance.
        This is done by using the `__import__` method to import the module and
        then using the `getattr` method to get the class from the module.

        Args:
            None

        Returns:
            The class instance associated with this Enum value.
        """
        module_name, class_name = self.value.rsplit('.', 1)
        module = __import__(module_name, fromlist=[class_name])
        return getattr(module, class_name)
    
    def initialize(self, run_config: dict = None, *args, **kwargs):
        """
        Initialize a task with the given run configuration.

        This method is the preferred way to initialize a task. It takes care of
        getting the class instance associated with this Enum value and passing
        the run configuration to the class's constructor.

        Args:
            run_config (dict, optional): The run configuration for the task.

        Returns:
            An instance of the class associated with this Enum value.
        """
        # Get the class and initialize it
        cls = self.get_class()
        # if run_config was passed, init the class with the run_config else use the default
        return cls(run_config, *args, **kwargs) if run_config is not None else cls(*args, **kwargs)

        
    @staticmethod
    def from_string(task_type: str):
        try:
            return TaskCatalog[task_type]
        except KeyError:
            raise ValueError(f"Task type {task_type} is not supported.")