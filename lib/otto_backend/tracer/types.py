from pydantic import BaseModel
from typing import List, Dict, Union

class BlockTrace(BaseModel):
    input: Union[str, List, Dict, None]
    output: Union[str, List, Dict, None]
    execution_time: float

class WorkflowTrace(BaseModel):
    input: Dict[str, BlockTrace]
    process: Dict[str, BlockTrace]
    output: Dict[str, BlockTrace]