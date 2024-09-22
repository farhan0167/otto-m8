from fastapi import FastAPI, Request
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
async def root(data: Request):
    req = await data.json()
    text = req['text']
    output = workflow.run_workflow(payload=text)
    print(output)
    try:
        output = json.loads(output)
    except:
        for process_name, process_outputs in output.items():
            for i, process_output in enumerate(process_outputs):
                for key, value in process_output.items():
                    if not (isinstance(value, str) or isinstance(value, int) or isinstance(value, float)):
                        output[process_name][i][key] = str(value)
        output = json.dumps(output)
                
                

    return {"message": output}