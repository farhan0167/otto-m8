import base64
import tempfile

from integrations.langchain.pdf_loader import PDFLoader
from core.types import InputType
from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType,
    StaticDropdownOption
)

class LangchainPDFLoader(BaseImplementation):
    display_name = 'PDF Loader'
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(name="button_text", is_run_config=False, default_value="Upload PDF", show_in_ui=False),
        Field(name="files_to_accept", is_run_config=False, default_value="application/pdf", show_in_ui=False),
        Field(name="input_type", display_name="Input Type", is_run_config=True, show_in_ui=False,
              type=FieldType.STATIC_DROPDOWN.value,
              default_value=InputType.FILE.value,
              metadata={
                  'dropdown_options': [
                      StaticDropdownOption(value=InputType.FILE.value, label="File").__dict__,
                      StaticDropdownOption(value=InputType.URL.value, label="URL").__dict__,
              ]}
        ),
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