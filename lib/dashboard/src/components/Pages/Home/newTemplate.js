import { initialDataTextInput } from "../../Block/InputBlocks/TextInput/initialData"
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
        initialDataTextInput(),
        { id: '2', type: 'placeholderBlock', position: { x: 520, y: 135 }, data: { label: 'placeholder' }, ...nodeDefaults },
        { id: '3', type: 'output', position: { x: 700, y: 150 }, data: { label: 'Output Block' }, ...nodeDefaults },
      ],
      reference_template_id: null
   } 
}