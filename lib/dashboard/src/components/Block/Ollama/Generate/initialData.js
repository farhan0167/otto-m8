export const initialDataOllamaServerGenerate = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Task Block', 
            'model': 'llama3', 
            'process_type': 'ollama_server_generate',
            'logo': {
                'src': '/assets/ollama.png', 
                'height': '10%',
                'width': '10%'
            },
            'endpoint': 'http://host.docker.internal:11434/api/generate',
            'system': null,
            'temperature': null
        },
        type: nodeType,
      };
}