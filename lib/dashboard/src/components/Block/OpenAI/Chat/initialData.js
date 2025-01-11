import { v4 as uuidv4 } from 'uuid';

export const initialDataOpenAIChat = (nodeType, block_code) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '',
            'model': 'gpt-4o-mini', 
            'core_block_type': 'openai_chat',
            'process_type': 'task',
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
            'source_code': block_code
        },
        type: nodeType,
      };
}