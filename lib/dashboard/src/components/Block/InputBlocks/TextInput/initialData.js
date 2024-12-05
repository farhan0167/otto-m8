import { Position } from '@xyflow/react';
import { InputBlockType } from '../types.tsx';

const nodeDefaults = {
    sourcePosition: Position.Right
};

export const initialDataTextInput = () => {
    return { 
        id: '1', 
        type: 'input', 
        position: { x: 300, y: 150 }, 
        data: { 
            label: 'Input Block', 
            input_type: InputBlockType.TEXT, 
            custom_name: 'user_input',
            core_block_type: 'text_input',
            process_type: 'task'
        }, 
        ...nodeDefaults, 
        deletable:false 
    }
}