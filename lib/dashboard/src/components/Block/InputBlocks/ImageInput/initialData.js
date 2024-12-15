import { Position } from '@xyflow/react';
import { InputBlockType } from '../types.tsx';

const nodeDefaults = {
    sourcePosition: Position.Right
};

export const initialDataImageInput = (nodeType) => {
    return { 
        id: Math.random().toString(36).substr(2, 5),
        type: 'input', 
        position: { x: 300, y: 150 }, 
        data: { 
            label: 'Image Input Block', 
            input_type: InputBlockType.FILE, 
            custom_name: 'image_input',
            core_block_type: 'image_input',
            process_type: 'task',
            button_text: 'Upload Image'
        }, 
        ...nodeDefaults, 
        deletable:false 
    }
}