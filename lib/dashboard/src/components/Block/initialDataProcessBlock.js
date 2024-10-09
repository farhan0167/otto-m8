import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";
import { initialDataOllamaServerGenerate } from "./Ollama/Generate/initialData";
import { initialDataOllamaServerChat } from "./Ollama/Chat/initialData";
import { initialDataHTTPPost } from "./HTTP/POST/initialData";

export const initialDataProcessBlock = ({nodeType, processBlockType}) => {
    if (processBlockType === 'hugging_face_model_card') {
        return initialDataHuggingFaceModelCard(nodeType)
    }
    if (processBlockType === 'ollama_server_generate') {
        return initialDataOllamaServerGenerate(nodeType)
    }
    if (processBlockType === 'ollama_server_chat') {
        return initialDataOllamaServerChat(nodeType)
    }

    // Integration blocks go here
    if (processBlockType === 'http_post_request') {
        return initialDataHTTPPost(nodeType)
    }
}