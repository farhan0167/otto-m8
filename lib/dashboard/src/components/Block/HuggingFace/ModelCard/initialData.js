import { v4 as uuidv4 } from 'uuid';

export const initialDataHuggingFaceModelCard = (nodeType, block_code) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '', 
            'modelCard': 'bert-base-uncased', 
            'core_block_type': 'hugging_face_model_card',
            'process_type': 'task',
            'logo': {
                'src': '/assets/hugging_face_model_card.png', 
                'height': '50%',
                'width': '16%'
            },
            'pass_input_to_output': false,
            'source_code': block_code
        },
        type: nodeType,
      };
}