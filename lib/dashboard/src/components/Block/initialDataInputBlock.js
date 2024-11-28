import { initialDataLangchainPDFParser } from "./InputBlocks/Langchain/PDFParser/initialData"

export const initialDataInputBlock = ({nodeType, core_block_type}) => {
    if (core_block_type === 'langchain_pdf_loader') {
        return initialDataLangchainPDFParser(nodeType)
    }
}