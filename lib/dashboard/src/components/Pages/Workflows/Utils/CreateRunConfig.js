import { HuggingFaceModelCardRunConfig } from "../../../Block/HuggingFace/ModelCard/runConfig"
import { OllamaServerGenerateRunConfig } from "../../../Block/Ollama/Generate/runConfig"
import { OllamaServerChatRunConfig } from "../../../Block/Ollama/Chat/runConfig"
import { HTTPPostRunConfig } from "../../../Block/HTTP/POST/runConfig"
import { OpenAIChatRunConfig } from "../../../Block/OpenAI/Chat/runConfig"
import { LambdaFunctionRunConfig } from "../../../Block/Lambda/runConfig"
import { HuggingFaceMultimodalRunConfig } from "../../../Block/HuggingFace/MultimodalPipeline/runConfig"

/**
 * Given a node's data object, returns a run configuration object
 * that can be used to initialize a specific task by the backend.
 * Run configurations are block specific configurations that are usually
 * set by the users that will dictate the behavior of the block (or in other
 * words, the behavior of the implementation of the block).
 * 
 * Currently, this function supports the following process types:
 * - 'hugging_face_model_card'
 * - 'ollama_server_generate'
 */
export const createRunConfigForNode = (data) => {
    // TODO: Create Run Config
    let run_config = {}

    if (data.reference_core_block_type === 'hugging_face_model_card') {
        run_config = HuggingFaceModelCardRunConfig(data, run_config)
        return run_config
    }

    if (data.reference_core_block_type === 'hugging_face_multimodal') {
        run_config = HuggingFaceMultimodalRunConfig(data, run_config)
        return run_config
    }
    // TODO: This is a temporary fix for Issue #12 and addressed in PR #49, clean this up.
    if (data.prompt){
        data.prompt = cleanString(data.prompt)
    }
    if (data.system){
        data.system = cleanString(data.system)
    }

    if (data.reference_core_block_type === 'ollama_server_generate') {
        run_config = OllamaServerGenerateRunConfig(data, run_config)
        return run_config
    }

    if (data.reference_core_block_type === 'ollama_server_chat') {
        run_config = OllamaServerChatRunConfig(data, run_config)
        return run_config
    }

    if (data.reference_core_block_type === 'openai_chat') {
        run_config = OpenAIChatRunConfig(data, run_config)
        return run_config
    }

    // Integration blocks go here
    if (data.reference_core_block_type === 'http_post_request') {
        run_config = HTTPPostRunConfig(data, run_config)
        return run_config
    }

    if (data.reference_core_block_type === 'lambda_function') {
        run_config = LambdaFunctionRunConfig(data, run_config)
        return run_config
    }

    return run_config
}

const cleanString = (data) => {
    return data
    .replace(/\r?\n|\r/g, '\\n')   // Escape newlines (both \n and \r\n)
    .replace(/\t/g, '\\t')        // Escape tabs
    .replace(/[^\x20-\x7E]/g, '');
}