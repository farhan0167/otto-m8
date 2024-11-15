import { initialDataStandardOutput } from "./OutputBlocks/StandardOutput/initialData"
import { initialDataChatOutput } from "./OutputBlocks/ChatOutput/initialData"

export const initialDataOutputBlock = ({nodeType, core_block_type}) => {
    if (core_block_type === 'output') {
        return initialDataStandardOutput(nodeType)
    }
    if (core_block_type === 'chat_output') {
        return initialDataChatOutput(nodeType)
    }
}