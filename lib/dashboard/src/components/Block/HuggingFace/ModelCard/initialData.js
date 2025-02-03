import { v4 as uuidv4 } from 'uuid';
import { sha1 } from 'js-sha1';

export const initialDataHuggingFaceModelCard = (nodeType, block_code, process_type) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        position: { x: 500, y: 100 },
        data: { 
            label: uuidv4(), 
            'custom_name': '', 
            'modelCard': 'bert-base-uncased', 
            'core_block_type': 'hugging_face_model_card',
            'process_type': process_type,
            'logo': {
                'src': '/assets/hugging_face_model_card.png', 
                'height': '50%',
                'width': '16%'
            },
            'pass_input_to_output': false,
            'source_code': block_code['source_code'],
            'source_hash': sha1(block_code['source_code']),
            'source_path': block_code['source_path']
        },
        type: nodeType,
      };
}