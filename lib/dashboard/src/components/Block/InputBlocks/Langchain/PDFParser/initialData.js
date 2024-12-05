import { Position } from '@xyflow/react';
import { InputBlockType } from '../../types.tsx';

const nodeDefaults = {
    sourcePosition: Position.Right
};

export const initialDataLangchainPDFParser = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        type: 'input',
        position: { x: 300, y: 50 },
        data: {
            label: 'Langchain PDF Parser',
            custom_name: 'pdf',
            input_type: InputBlockType.FILE,
            core_block_type: 'langchain_pdf_loader',
            process_type: 'task',
            files_to_accept: 'application/pdf'
        },
        ...nodeDefaults
      };
}