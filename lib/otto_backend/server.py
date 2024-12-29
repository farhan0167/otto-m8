from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from engine.workflow import RunWorkflow
from engine.blocks import WorkflowTemplate
import json

# Read the escaped JSON from file
with open('data.json', 'r') as file:
    json_payload = file.read()

# Load the JSON as a dictionary
execution = json.loads(json_payload)

template = WorkflowTemplate(**execution)
workflow = RunWorkflow(template)
workflow.initialize_resources()

app = FastAPI()

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowRunRequest(BaseModel):
    data: dict
    
@app.get("/workflow_run/health_check")
async def health_check():
    return {"message": "OK"}

@app.post("/workflow_run")
async def root(request: WorkflowRunRequest):
    payload = None
    try:
        payload = request.data
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
    if not payload:
        #TODO Change this exception
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
    output = workflow.run_workflow(payload=payload)
    output = output['Output_Block']['block_output']
    output = json.dumps(output)   

    return {"message": output}

@app.post("/workflow_run/run_chat")
async def chat(request: WorkflowRunRequest):
    payload = None
    try:
        payload = request.data
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
    if not payload:
        #TODO Change this exception
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
    output = workflow.run_workflow(payload=payload)
    output = output['Chat_Output']['block_output']
    output = list(output.values())[0]

    return output

@app.get("/workflow_run/get_chat_history")
async def get_chat_history():
    workflow_outputs = workflow.workflow.output
    chat_output = None
    for output in workflow_outputs:
        if output.name == 'Chat_Output':
            chat_output = output.implementation
    chat_history = chat_output.chat_history
    return {"chat_history": chat_history}

@app.delete("/workflow_run/clear_chat_history")
async def clear_chat_history():
    workflow_outputs = workflow.workflow.output
    chat_output = None
    for output in workflow_outputs:
        if output.name == 'Chat_Output':
            chat_output = output.implementation
    chat_output.chat_history = []
    return {"message": "Chat history cleared"}