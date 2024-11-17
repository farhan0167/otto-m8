from collections import defaultdict, deque
from typing import Any, Union, List
from blocks import WorkflowTemplate, InputBlock
from tasks.implementer import Implementer
from integrations.implementer import IntegrationImplementer

    
class RunWorkflow:
    def __init__(self, workflow: WorkflowTemplate):
        self.workflow = workflow
        self.block_name_map = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
        
    def create_block_name_map(self):
        inputs = self.workflow.input
        for i, block in enumerate(inputs):
            self.block_name_map['input'][block.name]['index'] = i
            self.block_name_map['input'][block.name]['block'] = block
            self.block_name_map['input'][block.name]['block_output'] = ''
            self.block_name_map['input'][block.name]['reverse_connection'] = None
        processes = self.workflow.process
        for i, block in enumerate(processes):
            self.block_name_map['process'][block.name]['index'] = i
            self.block_name_map['process'][block.name]['block'] = block
            self.block_name_map['process'][block.name]['block_output'] = ''
            self.block_name_map['process'][block.name]['reverse_connection'] = []

        outputs = self.workflow.output
        for i, block in enumerate(outputs):
            self.block_name_map['output'][block.name]['index'] = i
            self.block_name_map['output'][block.name]['block'] = block
            self.block_name_map['output'][block.name]['block_output'] = ''
            self.block_name_map['output'][block.name]['reverse_connection'] = []
        
        self.block_name_map = dict(self.block_name_map)
    
    def get_all_reverse_connections(self):
        """Function to find the inverse connections of every block in the workflow.
        Basically, we know every block is connected to some block in the workflow. If
        a current block is connected to some next block, we know that the next block is
        connected to the current block in the inverse direction. Therefore every connections
        within the process block could help us find the inverse connections of every block in the
        output blocks, so on and so forth. The input blocks will not have any inverse connections.
        """
        # Find inverse connections of every output block.
        for block in self.workflow.process:
            block_is_connected_to = block.connections
            # For every block the current block is connected to
            for i in range(len(block_is_connected_to)):
                # current block is connected to 
                workflow_group, group_block_name = block_is_connected_to[i].split('.')
                inverse_connection_of_connected_block = f"{block.block_type}.{block.name}"
                self.block_name_map[workflow_group][group_block_name]\
                    ['reverse_connection'].append(inverse_connection_of_connected_block)

        # Find inverse connections of every process block.
        for block in self.workflow.input:
            block_is_connected_to = block.connections
            # For every block the current block is connected to
            for i in range(len(block_is_connected_to)):
                # current block is connected to 
                workflow_group, group_block_name = block_is_connected_to[i].split('.')
                inverse_connection_of_connected_block = f"{block.block_type}.{block.name}"
                self.block_name_map[workflow_group][group_block_name]\
                    ['reverse_connection'].append(inverse_connection_of_connected_block)
    
    def initialize_block(
        self, 
        workflow_group, 
        block,
        client_input_type,
        visited
    ):
        if workflow_group == 'process' and block.name not in visited:
            process_metadata = block.process_metadata
            run_config = block.run_config
            # Add input type to the run configuration
            run_config['input_type'] = client_input_type
            if process_metadata['process_type'] == 'task':
                process = Implementer().create_task(
                    task_type=process_metadata['core_block_type'],
                    run_config=run_config
                )
            elif process_metadata['process_type'] == 'integration':
                process = IntegrationImplementer().create_integration(
                    integration_type=process_metadata['core_block_type'],
                    run_config=run_config
                )
            else:
                raise ValueError(f"Process type {process_metadata['process_type']} is not supported")
        elif workflow_group == 'output' and block.name not in visited:
            # TODO: This is a bit of a hack. Come back to this later.
            if block.name == 'Output_Block':
                process = Implementer().create_task(
                    task_type='output'
                )
            else:
                process = Implementer().create_task(
                    task_type='chat_output'
                )
        block.implementation = process
        visited.append(block.name)
        
        for connection in block.connections:
            workflow_group, group_block_name = connection.split('.')
            next_hop_index = self.block_name_map[workflow_group][group_block_name]['index']
            if workflow_group == 'process':
                next_hop = self.workflow.process[next_hop_index]
            else:
                next_hop = self.workflow.output[next_hop_index]
            self.initialize_block(
                workflow_group=workflow_group,
                block=next_hop,
                client_input_type=client_input_type,
                visited=visited
            )
        
    def initialize_resources(self, *args: Any, **kwds: Any) -> Any:
        inputs = self.workflow.input
        self.create_block_name_map()
        self.get_all_reverse_connections()
        
        for client_input in inputs:
            for connection in client_input.connections:
                workflow_group = connection.split('.')[0]
                group_block_name = connection.split('.')[1]
                next_hop_index = self.block_name_map[workflow_group][group_block_name]['index']
                next_hop = self.workflow.process[next_hop_index]
                visited = []
                self.initialize_block(
                    workflow_group=workflow_group,
                    block=next_hop,
                    client_input_type=client_input.input_type,
                    visited=visited
                )
                
    
    
    def run_workflow(self, payload=None, *args: Any, **kwds: Any) -> Any:
        # Set the input block's output data as the payload. Assumes only 1 input block.
        self.block_name_map['input'][self.workflow.input[0].name]['block_output'] = payload
        output_implementer = self.workflow.output[0].implementation
        
        visited = set()
        start_block = self.workflow.input[0]
        Queue =deque([start_block])
        visited.add(start_block.name)
        
        while Queue:
            block = Queue.popleft()
            # Process block logic.
            if not block:
                break
            if block.block_type == 'input':
                print("")
            else:
                current_group, current_name = block.block_type, block.name
                previous_hops = self.block_name_map[current_group][current_name]['reverse_connection']
                
                if block.block_type == 'process':
                    current_name_output = ''
                    input_ = {}
                    for previous_hop in previous_hops:
                        previous_hop_group, previous_hop_name = previous_hop.split('.')
                        # previous block's output is current block's input.
                        previous_block_output = self.block_name_map[previous_hop_group]\
                            [previous_hop_name]['block_output']
                        previous_block_custom_name = self.block_name_map[previous_hop_group]\
                            [previous_hop_name]['block'].custom_name
                        input_[previous_block_custom_name] = previous_block_output
                        
                    current_name_output = block.implementation.run(input_=input_)
                    self.block_name_map[current_group][current_name]['block_output'] = current_name_output
                elif block.block_type == 'output':
                    current_name_output = {}
                    for previous_hop in previous_hops:
                        previous_hop_group, previous_hop_name = previous_hop.split('.')
                        # previous block's output is current block's input.
                        current_name_output[previous_hop_name] = block.implementation.run(
                            output=self.block_name_map[previous_hop_group] \
                                [previous_hop_name]['block_output'],
                            inbound_process_name=previous_hop_name,
                            user_input=payload
                        )
                    self.block_name_map[current_group][current_name]['block_output'] = current_name_output

            # once a block is processed, add it's children to the queue if they haven't been visited.
            for connection in block.connections:
                workflow_group, group_block_name = connection.split('.')
                if group_block_name not in visited:
                    visited.add(group_block_name)
                    Queue.append(self.block_name_map[workflow_group][group_block_name]['block'])
        

        return self.block_name_map['output']
                    
        
        