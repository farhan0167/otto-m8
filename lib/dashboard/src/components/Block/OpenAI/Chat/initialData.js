export const initialDataOpenAIChat = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Task Block', 
            'model': 'gpt-4o-mini', 
            'core_block_type': 'openai_chat',
            'process_type': 'task',
            'logo': {
                'src': '/assets/openai.png', 
                'height': '40%',
                'width': '40%'
            },
            'system': 'You are a helpful assistant.',
            'openai_api_key': null,
            'tools': []
        },
        type: nodeType,
      };
}