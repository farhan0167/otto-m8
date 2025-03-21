import { Position } from "@xyflow/react";

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };

export const NewTemplate = () => {
   return {
      id: null,
      name: 'Untitled',
      description: '',
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
      ],
      nodes: [
        { id: '2', type: 'placeholderBlock', position: { x: 520, y: 135 }, data: { label: 'placeholder' }, ...nodeDefaults }
      ],
      reference_template_id: null
   } 
}