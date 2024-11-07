
export const OpenAIChatRunConfig = (data, run_config) => {
    run_config['model'] = data.model
    run_config['pass_input_to_output'] = data.pass_input_to_output
    if (data.system != null) {
        run_config['system'] = data.system
    }
    if (data.openai_api_key != null) {
        run_config['openai_api_key'] = data.openai_api_key
    }
    if (data.tools.length > 0) {
        run_config['tools'] = data.tools
    }

    return run_config
}