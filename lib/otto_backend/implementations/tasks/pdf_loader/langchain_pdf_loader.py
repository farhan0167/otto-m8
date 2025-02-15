import base64
import tempfile

from integrations.langchain.pdf_loader import PDFLoader
from implementations.base import BaseImplementation

class LangchainPDFLoader(BaseImplementation):
    display_name = 'PDF Loader'
    
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