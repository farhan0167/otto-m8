
export const HuggingFaceMultimodalRunConfig = (data, run_config) => {
    run_config['model_card'] = data.modelCard
    run_config['pass_input_to_output'] = data.pass_input_to_output
    run_config['image_input'] = data.image_input
    run_config['text_input'] = data.text_input
    run_config['huggingface_task_type'] = data.huggingface_task_type
    return run_config
}