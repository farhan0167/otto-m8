import { v4 as uuidv4 } from 'uuid';
import { sha1 } from 'js-sha1';

export const initialDataLambdaFunction = (nodeType, core_block_type, block_code, process_type) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '',
            'lambda_function_name': null, 
            'core_block_type': core_block_type,
            'reference_core_block_type': 'lambda_function',
            'process_type': process_type,
            'source_code': block_code['source_code'],
            'source_hash': sha1(block_code['source_code']),
            'source_path': block_code['source_path']
        },
        type: nodeType,
      };
}