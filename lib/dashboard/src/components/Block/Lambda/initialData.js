export const initialDataLambdaFunction = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Lambda Block',
            'lambda_function_name': null, 
            'core_block_type': 'lambda_function',
            'process_type': 'integration'
        },
        type: nodeType,
      };
}