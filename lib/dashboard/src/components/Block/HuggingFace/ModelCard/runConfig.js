
export const HuggingFaceModelCardRunConfig = (data, run_config) => {
    run_config['model_card'] = data.modelCard
    return run_config
}