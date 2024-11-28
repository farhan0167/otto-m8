from langchain_community.document_loaders import PyPDFLoader

class PDFLoader:
    def __init__(self, file_path):
        self.loader = PyPDFLoader(file_path)
    
    def parse(self):
        docs = []
        docs_lazy = self.loader.lazy_load()
        for doc in docs_lazy:
            docs.append(doc.page_content)
        return docs