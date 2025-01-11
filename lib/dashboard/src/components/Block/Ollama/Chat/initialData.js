import { v4 as uuidv4 } from 'uuid';

export const initialDataOllamaServerChat = (nodeType, block_code) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '',
            'model': 'llama3.2', 
            'core_block_type': 'ollama_server_chat',
            'process_type': 'task',
            'logo': {
                'src': '/assets/ollama.png', 
                'height': '10%',
                'width': '10%'
            },
            'endpoint': 'http://host.docker.internal:11434/api/chat',
            'system': 'You are a helpful assistant.',
            'prompt': '',
            'temperature': null,
            'tools': [],
            'pass_input_to_output': false,
            'source_code': block_code
        },
        type: nodeType,
      };
}