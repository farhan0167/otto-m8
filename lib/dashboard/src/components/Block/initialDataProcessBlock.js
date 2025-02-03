import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";
import { initialDataOllamaServerGenerate } from "./Ollama/Generate/initialData";
import { initialDataOllamaServerChat } from "./Ollama/Chat/initialData";
import { initialDataHTTPPost } from "./HTTP/POST/initialData";
import { initialDataOpenAIChat } from "./OpenAI/Chat/initialData";
import { initialDataLambdaFunction } from "./Lambda/initialData";
import { initialDataHuggingFaceMultimodal } from "./HuggingFace/MultimodalPipeline/initialData";

export const initialDataProcessBlock = ({nodeType, core_block_type, block_code, process_type}) => {
    if (core_block_type === 'hugging_face_model_card') {
        return initialDataHuggingFaceModelCard(nodeType, block_code, process_type)
    }
    if (core_block_type === 'hugging_face_multimodal') {
        return initialDataHuggingFaceMultimodal(nodeType, block_code, process_type)
    }
    if (core_block_type === 'ollama_server_generate') {
        return initialDataOllamaServerGenerate(nodeType, block_code, process_type)
    }
    if (core_block_type === 'ollama_server_chat') {
        return initialDataOllamaServerChat(nodeType, block_code, process_type)
    }
    if (core_block_type === 'openai_chat') {
        return initialDataOpenAIChat(nodeType, block_code, process_type)
    }

    // Integration blocks go here
    if (core_block_type === 'http_post_request') {
        return initialDataHTTPPost(nodeType, block_code, process_type)
    }

    if (core_block_type === 'lambda_function') {
        return initialDataLambdaFunction(nodeType, block_code, process_type)
    }
}