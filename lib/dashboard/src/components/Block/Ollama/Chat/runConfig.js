
export const OllamaServerChatRunConfig = (data, run_config) => {
    run_config['model'] = data.model
    run_config['pass_input_to_output'] = data.pass_input_to_output
    run_config['prompt_template'] = data.prompt
    
    if (data.system != null) {
        run_config['system'] = data.system
    }
    if (data.temperature != null) {
        run_config['temperature'] = data.temperature
    }
    if (data.endpoint != null) {
        run_config['endpoint'] = data.endpoint
    }
    if (data.tools.length > 0) {
        run_config['tools'] = data.tools
    }

    return run_config
}