import { v4 as uuidv4 } from 'uuid';

export const initialDataOllamaServerGenerate = (nodeType, block_code) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '',
            'model': 'llama3', 
            'core_block_type': 'ollama_server_generate',
            'process_type': 'task',
            'logo': {
                'src': '/assets/ollama.png', 
                'height': '10%',
                'width': '10%'
            },
            'endpoint': 'http://host.docker.internal:11434/api/generate',
            'system': null,
            'prompt': '',
            'temperature': null,
            'pass_input_to_output': false,
            'source_code': block_code
        },
        type: nodeType,
      };
}