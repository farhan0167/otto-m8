
export const HTTPPostRunConfig = (data, run_config) => {
    run_config['endpoint'] = data.endpoint
    return run_config
}