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
    // TODO: This is a temporary fix for Issue #12 and addressed in PR #49, clean this up.
    if (data.prompt){
        data.prompt = cleanString(data.prompt)
    }
    if (data.system){
        data.system = cleanString(data.system)
    }
    const sidebar_fields = data.sidebar_fields
    if (!sidebar_fields) {
        return run_config
    }
    // Anything in sidebar_fields is considered run config
    sidebar_fields.forEach(field => {
        run_config[field.name] = data[field.name]
    })
    return run_config
}

const cleanString = (data) => {
    return data
    .replace(/\r?\n|\r/g, '\\n')   // Escape newlines (both \n and \r\n)
    .replace(/\t/g, '\\t')        // Escape tabs
    .replace(/[^\x20-\x7E]/g, '');
}