from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from engine.workflow import RunWorkflow
from engine.blocks import WorkflowTemplate
import json

# Read the escaped JSON from file
with open('data.json', 'r') as file:
    escaped_json_payload = file.read()

# Unescape the JSON string
unescaped_json_payload = escaped_json_payload.replace('\\"', '"').replace('\\n', '\n')

# Load the JSON as a dictionary
execution = json.loads(unescaped_json_payload)

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

@app.post("/workflow_run")
async def root(data: Request, file: Optional[UploadFile] = File(None)):
    payload = None
    # Check if the content type is JSON, which indicates a text input
    if data.headers.get('content-type') == 'application/json':
        try:
            req = await data.json()
            payload = req.get('text', None)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # If a file is available, implicitly it should be an image.
    if file:
        # Read the file content
        payload = await file.read()
        file_name = file.filename
        
    if not payload:
        #TODO Change this exception
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
        
    output = workflow.run_workflow(payload=payload)
    output = output['Output_Block']['block_output']
    output = json.dumps(output)   

    return {"message": output}

@app.post("/workflow_run/run_chat")
async def chat(data: Request):
    payload = None
    # Check if the content type is JSON, which indicates a text input
    if data.headers.get('content-type') == 'application/json':
        try:
            req = await data.json()
            payload = req.get('text', None)
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