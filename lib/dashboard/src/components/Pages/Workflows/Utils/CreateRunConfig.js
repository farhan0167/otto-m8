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

    const sidebar_fields = data.sidebar_fields
    if (!sidebar_fields) {
        return run_config
    }
    // Anything in sidebar_fields is considered run config
    // sidebar_fields.forEach(field => {
    //     run_config[field.name] = data[field.name]
    // })
    run_config [ 'block_uuid' ] = data.label
    for (let i=0; i<sidebar_fields.length; i++){
        if (sidebar_fields[i].type === 'multimodal_selector') {
            run_config[ sidebar_fields[i].image.name ] = data[ sidebar_fields[i].image.name ]
            run_config[ sidebar_fields[i].text.name ] = data[ sidebar_fields[i].text.name ]
        }
        else if (sidebar_fields[i].type === 'gcloud_auth') {
            run_config['scopes'] = sidebar_fields[i].metadata.selected_options
        } 
        else if (
            sidebar_fields[i].type === 'text' 
            || sidebar_fields[i].type === 'textarea' 
            || sidebar_fields[i].type === 'prompt_template'
        ){
            run_config[sidebar_fields[i].name] = cleanString(data[sidebar_fields[i].name])
        }
        else{
            run_config[sidebar_fields[i].name] = data[sidebar_fields[i].name]
        }
    }
    return run_config
}

const cleanString = (data) => {
    return data
    .replace(/\r?\n|\r/g, '\\n')   // Escape newlines (both \n and \r\n)
    .replace(/\t/g, '\\t')        // Escape tabs
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/'/g, '"'); // replace any ' with " which solves Issue #12
}