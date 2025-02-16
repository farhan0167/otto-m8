import base64
import tempfile

from integrations.langchain.pdf_loader import PDFLoader
from core.types import InputType
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field
)

class LangchainPDFLoader(BaseImplementation):
    display_name = 'PDF Loader'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(name="input_type", display_name="Input Type", is_run_config=True, default_value=InputType.FILE.value, show_in_ui=False),
        Field(name="button_text", is_run_config=False, default_value="Upload PDF", show_in_ui=False),
        Field(name="files_to_accept", is_run_config=False, default_value="application/pdf", show_in_ui=False),
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        pass
    
    def run(self, input_ = None):
        input_ = base64.b64decode(input_)
        doc = None
        with tempfile.NamedTemporaryFile(delete=True) as f:
            f.write(input_)
            f.flush()
            doc_pages = PDFLoader(f.name).parse()
            doc = ' '.join(doc_pages)

        return doc