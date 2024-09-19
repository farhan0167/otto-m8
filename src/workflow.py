from typing import Any
from blocks import WorkflowTemplate, execution
from tasks.implementer import Implementer

class RunWorkflow:
    def __init__(self, workflow: WorkflowTemplate):
        self.workflow = workflow
        self.block_name_map = {
            'input': {},
            'process': {},
            'output': {}
        }
    
    def initialize_resources(self, *args: Any, **kwds: Any) -> Any:
        inputs = self.workflow.input
        processes = self.workflow.process
        self.block_name_map['process'] = {block.name: i for i, block in enumerate(processes)}
        outputs = self.workflow.output
        self.block_name_map['output'] = {block.name: i for i, block in enumerate(outputs)}
        
        output_implementer = Implementer().create_task(task_type=outputs[0].block_type)
        self.workflow.output[0].implementation = output_implementer
        
        for client_input in inputs:
            for connection in client_input.connections:
                workflow_group = connection.split('.')[0]
                group_block_name = connection.split('.')[1]
                next_hop_index = self.block_name_map['process'][group_block_name]
                next_hop = processes[next_hop_index]
                process_metadata = next_hop.process_metadata
                process = Implementer().create_task(task_type=process_metadata['process_type'])
                next_hop.implementation = process

        
    def run_workflow(self, *args: Any, **kwds: Any) -> Any:
        inputs = self.workflow.input
        processes = self.workflow.process
        self.block_name_map['process'] = {block.name: i for i, block in enumerate(processes)}
        outputs = self.workflow.output
        self.block_name_map['output'] = {block.name: i for i, block in enumerate(outputs)}
        
        output_implementer = self.workflow.output[0].implementation
        
        for client_input in inputs:
            for connection in client_input.connections:
                workflow_group = connection.split('.')[0]
                group_block_name = connection.split('.')[1]
                next_hop_index = self.block_name_map['process'][group_block_name]
                next_hop = processes[next_hop_index]
                run_config = next_hop.run_config
                process_output = next_hop.implementation.run(client_input.payload, run_config)
                for process_connection in next_hop.connections:
                    # TODO: This assumes that the next hop is an output block. This won't be necessarily true.
                    output_implementer.run(process_output, inbound_process_name=group_block_name)
                    
        return output_implementer.final_output
                
        
        
