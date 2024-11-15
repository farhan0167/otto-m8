import { Position } from '@xyflow/react';

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
};

export const initialDataStandardOutput = (nodeType) => {
    return {
        id: Math.random().toString(36).substr(2, 5),
        type: 'output',
        position: { x: 700, y: 50 },
        data: { label: 'Output Block' },
        ...nodeDefaults
      };
}