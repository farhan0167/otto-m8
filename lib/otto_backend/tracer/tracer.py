import time
import datetime
import json

from .types import BlockTrace, WorkflowTrace
from db.models import (
    WorkflowTemplates,
    TracerDBModel
)
from db.db_engine import get_session

class Tracer:
    def __init__(self) -> None:
        self.begin = time.time()
        self.begin_date = datetime.datetime.now()
        self.trace = WorkflowTrace(
            input = {},
            process = {},
            output = {}
        )
    
    def log(self, 
            block_name: str, 
            block_group:str, 
            block_input, 
            block_output, 
            execution_time:float
        ):
        block = BlockTrace(
            input = block_input,
            output = block_output,
            execution_time = execution_time
        )
        if block_group == 'input':
            self.trace.input[block_name] = block
        elif block_group == 'process':
            self.trace.process[block_name] = block
        elif block_group == 'output':
            self.trace.output[block_name] = block
    
    def save(self, template_id:int):
        
        execution_time = time.time() - self.begin
        end_date = datetime.datetime.now()
        
        with get_session() as db:
            template = db.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
            
            tracer = TracerDBModel(
                user_id = template.user_id,
                start_timestamp = self.begin_date,
                end_timestamp = end_date,
                template_id = template.id,
                execution_time = execution_time,
                log = self.trace.dict()
            )
            db.add(tracer)
            db.commit()