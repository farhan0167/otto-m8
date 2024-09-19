import io
import docker
import json
from fastapi import FastAPI, Request
from blocks import WorkflowTemplate, execution
import shutil
import tempfile
import os
import socket
from fastapi.middleware.cors import CORSMiddleware

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


def find_available_port(start_port, end_port):
    for port in range(start_port, end_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            result = s.connect_ex(('localhost', port))
            if result != 0:
                return port
    raise RuntimeError("No available ports in the specified range")

def create_container_with_in_memory_dockerfile(payload):
    # Initialize the Docker client
    client = docker.from_env()
    host_port = find_available_port(8000, 9000)
    json_payload = json.dumps(payload, indent=4)
    escaped_json_payload = json_payload.replace('"', '\\"').replace('\n', '\\n')
    
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Copy the files from your working directory to the temporary directory for docker build context
        source_dir = os.getcwd()
        shutil.copytree(source_dir, os.path.join(temp_dir, 'app_files'), dirs_exist_ok=True)

        # Create the Dockerfile content
        dockerfile_content = f"""
        FROM python:3.9-slim

        # Set the working directory
        WORKDIR /app

        # Copy existing FastAPI app code into the container
        COPY app_files /app

        # Install FastAPI and Uvicorn
        RUN pip install fastapi uvicorn

        # Write the JSON payload directly into the container
        RUN echo '{escaped_json_payload}' > /app/data.json

        # Command to run the FastAPI app with Uvicorn
        CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
        """
        
        # Write the Dockerfile to the temporary directory
        dockerfile_path = os.path.join(temp_dir, 'Dockerfile')
        with open(dockerfile_path, 'w') as dockerfile:
            dockerfile.write(dockerfile_content)

        # Build the Docker image from the temporary directory
        image, _ = client.images.build(
            path=temp_dir,
            # TODO add a field to the blocks for Workflow such that we can get name of the image based on payload
            tag="fastapi-in-memory-app",
            rm=True
        )

        # Run the container
        container = client.containers.run(
            image=image.id,
            ports={f'8000/tcp': host_port},
            detach=True
            # TODO add name of the container
        )

        print(f"Container started with ID: {container.short_id}")
        server_url = f"http://localhost:{host_port}/workflow_run"
        print(f"Run workflow with: {server_url}")
        return container, server_url


@app.post("/create_workflow/")
async def create_workflow(workflow: WorkflowTemplate):
    container, server_url = create_container_with_in_memory_dockerfile(workflow.dict())
    return {
        "status": "success",
        "server_url": server_url,
        "container_id": container.short_id
    }


#create_container_with_in_memory_dockerfile(execution)
