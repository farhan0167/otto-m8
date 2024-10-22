
export const LambdaFunctionRunConfig = (data, run_config) => {

    run_config['lambda_function_name'] = data.lambda_function_name

    return run_config
}