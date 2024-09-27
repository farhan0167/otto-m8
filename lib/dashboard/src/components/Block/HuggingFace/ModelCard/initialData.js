export const initialDataHuggingFaceModelCard = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: 'Task Block', 
            'modelCard': 'bert-base-uncased', 
            'process_type': 'hugging_face_model_card',
            'logo': {
                'src': '/assets/hugging_face_model_card.png', 
                'height': '20%',
                'width': '90%'
            },
        },
        type: nodeType,
      };
}