
export const OllamaServerGenerateRunConfig = (data, run_config) => {
    run_config['model'] = data.model
    if (data.system != null) {
        run_config['system'] = data.system
    }
    if (data.temperature != null) {
        run_config['temperature'] = data.temperature
    }
    if (data.endpoint != null) {
        run_config['endpoint'] = data.endpoint
    }

    return run_config
}