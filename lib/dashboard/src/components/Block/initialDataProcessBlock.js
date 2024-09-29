import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";
import { initialDataOllamaServerGenerate } from "./Ollama/Generate/initialData";

export const initialDataProcessBlock = ({nodeType, processBlockType}) => {
    if (processBlockType === 'hugging_face_model_card') {
        return initialDataHuggingFaceModelCard(nodeType)
    }
    if (processBlockType === 'ollama_server_generate') {
        return initialDataOllamaServerGenerate(nodeType)
    }
}