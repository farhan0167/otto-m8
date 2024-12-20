import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";
import { initialDataOllamaServerGenerate } from "./Ollama/Generate/initialData";
import { initialDataOllamaServerChat } from "./Ollama/Chat/initialData";
import { initialDataHTTPPost } from "./HTTP/POST/initialData";
import { initialDataOpenAIChat } from "./OpenAI/Chat/initialData";
import { initialDataLambdaFunction } from "./Lambda/initialData";
import { initialDataHuggingFaceMultimodal } from "./HuggingFace/MultimodalPipeline/initialData";

export const initialDataProcessBlock = ({nodeType, core_block_type}) => {
    if (core_block_type === 'hugging_face_model_card') {
        return initialDataHuggingFaceModelCard(nodeType)
    }
    if (core_block_type === 'hugging_face_multimodal') {
        return initialDataHuggingFaceMultimodal(nodeType)
    }
    if (core_block_type === 'ollama_server_generate') {
        return initialDataOllamaServerGenerate(nodeType)
    }
    if (core_block_type === 'ollama_server_chat') {
        return initialDataOllamaServerChat(nodeType)
    }
    if (core_block_type === 'openai_chat') {
        return initialDataOpenAIChat(nodeType)
    }

    // Integration blocks go here
    if (core_block_type === 'http_post_request') {
        return initialDataHTTPPost(nodeType)
    }

    if (core_block_type === 'lambda_function') {
        return initialDataLambdaFunction(nodeType)
    }
}