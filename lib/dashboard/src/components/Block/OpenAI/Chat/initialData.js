import { v4 as uuidv4 } from 'uuid';
import { sha1 } from 'js-sha1';

export const initialDataOpenAIChat = (nodeType, core_block_type, block_code, process_type) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '',
            'model': 'gpt-4o-mini', 
            'core_block_type': core_block_type,
            'reference_core_block_type': 'openai_chat',
            'process_type': process_type,
            'logo': {
                'src': '/assets/openai.png', 
                'height': '40%',
                'width': '40%'
            },
            'system': 'You are a helpful assistant.',
            'prompt': '',
            'openai_api_key': null,
            'tools': [],
            'pass_input_to_output': false,
            'source_code': block_code['source_code'],
            'source_hash': sha1(block_code['source_code']),
            'source_path': block_code['source_path']
        },
        type: nodeType,
      };
}