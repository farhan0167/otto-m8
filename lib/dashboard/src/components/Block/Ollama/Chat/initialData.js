export const initialDataOllamaServerChat = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Task Block', 
            'model': 'llama3.2', 
            'process_type': 'ollama_server_chat',
            'logo': {
                'src': '/assets/ollama.png', 
                'height': '10%',
                'width': '10%'
            },
            'endpoint': 'http://host.docker.internal:11434/api/chat',
            'system': 'You are a helpful assistant.',
            'temperature': null
        },
        type: nodeType,
      };
}