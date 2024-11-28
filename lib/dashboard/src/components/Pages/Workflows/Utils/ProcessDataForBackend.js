import { createRunConfigForNode } from "./CreateRunConfig";

export const processNodeDataForBackend = (nodes, edges) => {
    // Create a map of node IDs to node data
    const nodeMap = nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
  
    // Process connections based on edges
    const connectionsMap = edges.reduce((acc, edge) => {
      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];
  
      if (sourceNode && targetNode) {
        // Replace spaces with underscores in target label
        const formattedTargetLabel = targetNode.data.label.replace(/\s+/g, '_');
  
        if (!acc[sourceNode.data.label]) {
          acc[sourceNode.data.label] = [];
        }
        acc[sourceNode.data.label].push(`${targetNode.type}.${formattedTargetLabel}`);
      }
      return acc;
    }, {});
  
    // Categorize nodes into input, process, and output blocks
    const result = {
      input: [],
      process: [],
      output: []
    };
  
    nodes.forEach(node => {
      const { id, type, data } = node;
      const connections = connectionsMap[data.label] || [];
  
      // Replace spaces with underscores in node label
      const formattedLabel = data.label.replace(/\s+/g, '_');

      // Every block in the backend expects run config.
      const run_config = createRunConfigForNode(data)
  
      const formattedNode = {
        name: formattedLabel,
        custom_name: data.custom_name,
        block_type: type,
        connections,
        run_config
      };
  
      if (type === 'input') {
          // Every input block in the backend expects input_type
          if (data.input_type) {
            formattedNode['input_type'] = data.input_type
          }
          if (data.core_block_type){
            const process_metadata = {}
            process_metadata['core_block_type'] = data.core_block_type
            process_metadata['process_type'] = data.process_type
            formattedNode['process_metadata'] = process_metadata
          }
          result.input.push(formattedNode);
      } else if (type === 'output') {
          result.output.push(formattedNode);
      // Unless things change, if not input or output, we assume it's a process block
      } else {
          // Every task block will have process metadata that the backend expects.s
          const process_metadata = {}
          if (data.core_block_type){
            process_metadata['core_block_type'] = data.core_block_type
            process_metadata['process_type'] = data.process_type
          }
          formattedNode['process_metadata'] = process_metadata
          result.process.push(formattedNode);
        }
    });
  
    return result;
  };
  