export const initialDataHuggingFaceModelCard = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Task Block', 
            'modelCard': 'bert-base-uncased', 
            'core_block_type': 'hugging_face_model_card',
            'process_type': 'task',
            'logo': {
                'src': '/assets/hugging_face_model_card.png', 
                'height': '50%',
                'width': '16%'
            },
        },
        type: nodeType,
      };
}