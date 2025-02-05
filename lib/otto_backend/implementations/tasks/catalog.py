from enum import Enum
from ..base import BlockRegistry


class TaskCatalog(Enum):
    #### Catalog for Tasks ####
    # key = module.file_name.class_name
    HUGGING_FACE_MODEL_CARD = 'implementations.tasks.hugging_face.hugging_face_model_card.HuggingFaceModelCard'
    HUGGING_FACE_MULTIMODAL = 'implementations.tasks.hugging_face.hugging_face_multimodal.HuggingFaceMultimodalPipeline'
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
        
class TaskRegistry(BlockRegistry):
    process_type = "task"

# Register Tasks and Vendors
TaskRegistry.add_vendor("Hugging Face")
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Hugging Face",
    task=TaskCatalog.HUGGING_FACE_MODEL_CARD, 
    ui_block_type="process",
    source_path="implementations/tasks/hugging_face/hugging_face_model_card.py"
)
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Hugging Face",
    task=TaskCatalog.HUGGING_FACE_MULTIMODAL, 
    ui_block_type="process",
    source_path="implementations/tasks/hugging_face/hugging_face_multimodal.py"
)

TaskRegistry.add_vendor("Ollama")
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Ollama",
    task=TaskCatalog.OLLAMA_SERVER_GENERATE, 
    ui_block_type="process",
    source_path="implementations/tasks/ollama/ollama_server_generate.py"
)

TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Ollama",
    task=TaskCatalog.OLLAMA_SERVER_CHAT,
    ui_block_type="process",
    source_path="implementations/tasks/ollama/ollama_server_chat.py"
)

TaskRegistry.add_vendor("OpenAI")
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="OpenAI",
    task=TaskCatalog.OPENAI_CHAT,
    ui_block_type="process",
    source_path="implementations/tasks/openai/openai_chat.py"
)

TaskRegistry.add_vendor("Output Blocks")
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Output Blocks",
    task=TaskCatalog.OUTPUT,
    ui_block_type="output",
    source_path="implementations/tasks/output_blocks/output_block.py"
)

TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Output Blocks",
    task=TaskCatalog.CHAT_OUTPUT,
    ui_block_type="output",
    source_path="implementations/tasks/output_blocks/chat_output_block.py"
)

TaskRegistry.add_vendor("Langchain")
TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Langchain",
    task=TaskCatalog.LANGCHAIN_PDF_LOADER,
    ui_block_type="input",
    source_path="implementations/tasks/langchain/langchain_pdf_loader.py"
)

TaskRegistry.add_vendor("Input Blocks")
# TaskRegistry.add_block_to_registry_by_vendor(
#     vendor="Input Blocks",
#     task=TaskCatalog.TEXT_INPUT,
#     ui_block_type="input",
#     source_path="implementations/tasks/input_blocks/text_input_block.py"
# )

TaskRegistry.add_block_to_registry_by_vendor(
    vendor="Input Blocks",
    task=TaskCatalog.IMAGE_INPUT,
    ui_block_type="input",
    source_path="implementations/tasks/input_blocks/image_input_block.py"
)