from enum import Enum


class TaskCatalog(Enum):
    #### Catalog for Tasks ####
    # key = module.file_name.class_name
    HUGGING_FACE_MODEL_CARD = 'implementations.tasks.hugging_face.hugging_face_model_card.HuggingFaceModelCard'
    OLLAMA_SERVER_GENERATE = 'implementations.tasks.ollama.ollama_server_generate.OllamaServerGenarate'
    OLLAMA_SERVER_CHAT = 'implementations.tasks.ollama.ollama_server_chat.OllamaServerChat'
    OPENAI_CHAT = 'implementations.tasks.openai.openai_chat.OpenAIChat'
    OUTPUT = 'implementations.tasks.output_blocks.output_block.OutputBlock'
    CHAT_OUTPUT = 'implementations.tasks.output_blocks.chat_output_block.ChatOutputBlock'
    LANGCHAIN_PDF_LOADER = 'implementations.tasks.pdf_loader.langchain_pdf_loader.LangchainPDFLoader'
    TEXT_INPUT = 'implementations.tasks.input_blocks.text_input.text_input.TextInput'
    IMAGE_INPUT = 'implementations.tasks.input_blocks.image_input.image.ImageInput'
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
        
class TaskRegistry:
    vendors = {}
    
    @classmethod
    def add_vendor(cls, vendor: str):
        if vendor not in cls.vendors:
            cls.vendors[vendor] = {}
    
    @classmethod
    def add_task_to_registry_by_vendor(cls, vendor: str, task_name: str, task: TaskCatalog):
        if vendor not in cls.vendors:
            raise Exception(f"Vendor {vendor} is not supported.")
        cls.vendors[vendor][task_name] = task.name.lower()
    
    @classmethod
    def get_task_registry(cls):
        return cls.vendors

# Register Tasks and Vendors
TaskRegistry.add_vendor("Hugging Face")
TaskRegistry.add_task_to_registry_by_vendor("Hugging Face", "Model Card - Unimodal", TaskCatalog.HUGGING_FACE_MODEL_CARD)

TaskRegistry.add_vendor("Ollama")
TaskRegistry.add_task_to_registry_by_vendor("Ollama", "Ollama Generate", TaskCatalog.OLLAMA_SERVER_GENERATE)
TaskRegistry.add_task_to_registry_by_vendor("Ollama", "Ollama Chat", TaskCatalog.OLLAMA_SERVER_CHAT)

TaskRegistry.add_vendor("OpenAI")
TaskRegistry.add_task_to_registry_by_vendor("OpenAI", "Chat Completion", TaskCatalog.OPENAI_CHAT)

TaskRegistry.add_vendor("Output Blocks")
TaskRegistry.add_task_to_registry_by_vendor("Output Blocks", "Standard", TaskCatalog.OUTPUT)
TaskRegistry.add_task_to_registry_by_vendor("Output Blocks", "Chat Output", TaskCatalog.CHAT_OUTPUT)

TaskRegistry.add_vendor("Langchain")
TaskRegistry.add_task_to_registry_by_vendor("Langchain", "PDF Loader", TaskCatalog.LANGCHAIN_PDF_LOADER)

TaskRegistry.add_vendor("Input Blocks")
# TaskRegistry.add_task_to_registry_by_vendor("Input Blocks", "Text Input", TaskCatalog.TEXT_INPUT)
TaskRegistry.add_task_to_registry_by_vendor("Input Blocks", "Image Input", TaskCatalog.IMAGE_INPUT)