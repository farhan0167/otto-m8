
export const HuggingFaceModelCardRunConfig = (data, run_config) => {
    run_config['model_card'] = data.modelCard
    run_config['pass_input_to_output'] = data.pass_input_to_output
    return run_config
}