import { initialDataLangchainPDFParser } from "./InputBlocks/Langchain/PDFParser/initialData"
import { initialDataImageInput } from "./InputBlocks/ImageInput/initialData"

export const initialDataInputBlock = ({nodeType, core_block_type, process_type}) => {
    if (core_block_type === 'langchain_pdf_loader') {
        return initialDataLangchainPDFParser(nodeType)
    }
    else if (core_block_type === 'image_input') {
        return initialDataImageInput(nodeType)
    }
}