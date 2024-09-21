from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from workflow import RunWorkflow
from blocks import WorkflowTemplate
import json

# Read the escaped JSON from file
with open('data.json', 'r') as file:
    escaped_json_payload = file.read()

# Unescape the JSON string
unescaped_json_payload = escaped_json_payload.replace('\\"', '"').replace('\\n', '\n')

# Load the JSON as a dictionary
execution = json.loads(unescaped_json_payload)
print(execution)

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

@app.get("/workflow_run")
async def root():
    output = workflow.run_workflow()
    output = json.dumps(output)
    return {"message": output}