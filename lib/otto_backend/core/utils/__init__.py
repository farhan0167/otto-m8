import re
import json

def convert_frontend_tmp_2_backend_tmp(nodes, edges):
    # Create a map of node IDs to node data
    node_map = {node['id']: node for node in nodes}

    # Process connections based on edges
    connections_map = {}
    for edge in edges:
        source_node = node_map.get(edge['source'])
        target_node = node_map.get(edge['target'])
        
        if source_node and target_node:
            formatted_target_label = target_node['data']['label'].replace(" ", "_")
            
            if source_node['data']['label'] not in connections_map:
                connections_map[source_node['data']['label']] = []
            
            connections_map[source_node['data']['label']].append(f"{target_node['type']}.{formatted_target_label}")
    
    # Categorize nodes into input, process, and output blocks
    result = {'input': [], 'process': [], 'output': []}
    
    for node in nodes:
        node_id, node_type, data = node['id'], node['type'], node['data']
        connections = connections_map.get(data['label'], [])
        formatted_label = data['label'].replace(" ", "_")
        
        # Every block expects a run config
        run_config = create_run_config_for_node(data)
        
        formatted_node = {
            'name': formatted_label,
            'custom_name': data.get('custom_name'),
            'block_type': node_type,
            'connections': connections,
            'run_config': run_config
        }
        
        if node_type == 'input':
            if 'input_type' in data:
                formatted_node['input_type'] = data['input_type']
            if 'core_block_type' in data:
                process_metadata = {
                    'core_block_type': data['core_block_type'],
                    'process_type': data.get('process_type'),
                    'files_to_accept': data.get('files_to_accept'),
                    'button_text': data.get('button_text')
                }
                formatted_node['process_metadata'] = process_metadata
            result['input'].append(formatted_node)
        elif node_type == 'output':
            result['output'].append(formatted_node)
        else:
            process_metadata = {}
            if 'core_block_type' in data:
                process_metadata['core_block_type'] = data['core_block_type']
                process_metadata['process_type'] = data.get('process_type')
            formatted_node['process_metadata'] = process_metadata
            result['process'].append(formatted_node)
    
    return json.dumps(result)

def create_run_config_for_node(data):
    run_config = {}
    sidebar_fields = data.get('sidebar_fields')
    
    if not sidebar_fields:
        return run_config
    
    for field in sidebar_fields:
        if field['type'] == 'multimodal_selector':
            run_config[field['image']['name']] = data.get(field['image']['name'])
            run_config[field['text']['name']] = data.get(field['text']['name'])
        elif field['type'] in {'text', 'textarea', 'prompt_template'}:
            run_config[field['name']] = clean_string(data.get(field['name'], ''))
        else:
            run_config[field['name']] = data.get(field['name'])
    
    return run_config

def clean_string(data):
    return re.sub(r'[^\x20-\x7E]', '', data.replace('\n', '\\n').replace('\t', '\\t').replace("'", '"'))
