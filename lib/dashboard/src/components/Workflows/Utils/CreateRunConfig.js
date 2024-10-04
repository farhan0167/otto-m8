import { HuggingFaceModelCardRunConfig } from "../../Block/HuggingFace/ModelCard/runConfig"
import { OllamaServerGenerateRunConfig } from "../../Block/Ollama/Generate/runConfig"
import { OllamaServerChatRunConfig } from "../../Block/Ollama/Chat/runConfig"

/**
 * Given a node's data object, returns a run configuration object
 * that can be used to initialize a specific task by the backend.
 * 
 * Currently, this function supports the following process types:
 * - 'hugging_face_model_card'
 * - 'ollama_server_generate'
 */
export const createRunConfigForNode = (data) => {
    // TODO: Create Run Config
    let run_config = {}

    if (data.process_type === 'hugging_face_model_card') {
        run_config = HuggingFaceModelCardRunConfig(data, run_config)
        return run_config
    }

    if (data.process_type === 'ollama_server_generate') {
        run_config = OllamaServerGenerateRunConfig(data, run_config)
        return run_config
    }

    if (data.process_type === 'ollama_server_chat') {
        run_config = OllamaServerChatRunConfig(data, run_config)
        return run_config
    }

    return run_config
}
