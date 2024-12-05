from collections import defaultdict, deque
from typing import Any
from engine.blocks import WorkflowTemplate, StartBlock
from implementations.tasks.implementer import Implementer
from implementations.integrations.implementer import IntegrationImplementer

    
class RunWorkflow:
    def __init__(self, workflow: WorkflowTemplate):
        self.workflow = workflow
        self.block_name_map = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
        
    def create_block_name_map(self):
        """Create a mapping of block names to block objects and their associated metadata."""
        for workflow_group, blocks in self.workflow.__dict__.items():
            if workflow_group not in ['input', 'process', 'output']:
                continue
            for i, block in enumerate(blocks):
                block_name = block.name
                self.block_name_map[workflow_group][block_name] = {
                    'index': i,
                    'block': block,
                    'block_output': '',
                    'reverse_connection': [] if workflow_group != 'input' else None
                }
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
        if block.name in visited:
            return
        process = None
        if (
            workflow_group == 'input' and 
            block.name not in visited
        ):
            process_metadata = block.process_metadata
            if process_metadata['process_type'] == 'task':
                process = Implementer().create_task(
                    task_type=process_metadata['core_block_type']
                )
            else:
                raise ValueError(f"Process type {process_metadata['process_type']} is not supported")
        elif workflow_group == 'process' and block.name not in visited:
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
            if workflow_group == 'input':
                next_hop = self.workflow.input[next_hop_index]
            elif workflow_group == 'process':
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
        self.create_block_name_map()
        self.get_all_reverse_connections()
        visited = []
        
        inputs = self.workflow.input
        for client_input in inputs:
            workflow_group = client_input.block_type
            self.initialize_block(
                workflow_group=workflow_group,
                block=client_input,
                client_input_type=client_input.input_type,
                visited=visited
            )
                
    
    
    def run_workflow(self, payload:dict=None, *args: Any, **kwds: Any) -> Any:
        """
        Main function to run the workflow based on the input payload.
        This implements a breadth first search traversal of every block(node)
        in the workflow(graph).
        """
        visited = set()
        start_block = self.get_start_block()
        Queue =deque([start_block])
        visited.add(start_block.name)
        
        while Queue:
            # Get the next block from the queue
            block = Queue.popleft()
            if not block:
                break
            # Process block logic.
            self.process_BFS_step(block, payload)

            # once a block is processed, add it's children to the queue if they haven't been visited.
            for connection in block.connections:
                workflow_group, group_block_name = connection.split('.')
                if group_block_name not in visited:
                    visited.add(group_block_name)
                    Queue.append(self.block_name_map[workflow_group][group_block_name]['block'])
        

        return self.block_name_map['output']
    
    def process_BFS_step(self, block, payload):
        """ 
        Logic to process a block. Depending on the block type, different
        implmenetation of the block will be invoked via the run method
        of each block's implementation.
        """
        if block.block_type != 'start_node':
            current_group, current_name = block.block_type, block.name
            previous_hops = self.block_name_map[current_group][current_name]['reverse_connection']
            
            if block.block_type == 'input':
                input_ = payload[current_name]
                if not input_:
                    current_name_output = "None"
                else:
                    current_name_output = block.implementation.run(input_=input_)
                self.block_name_map[current_group][current_name]['block_output'] = current_name_output
                
            elif block.block_type == 'process':
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
    
    def get_start_block(self):
        """
        Get the start block of the workflow, which is a special type of block
        that has connections to all the input blocks in the workflow. This 
        specifically helps when there are multiple input blocks.

        Returns:
            StartBlock: The start block of the workflow.
        """
        start_block = StartBlock()
        # Get all connections for start block
        inputs = self.workflow.input
        for input_block in inputs:
            start_block.connections.append(f"{input_block.block_type}.{input_block.name}")
            
        return start_block
                    
        
        