import io
import json
import shutil
import tempfile
import os
import socket

import docker
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from db.base import Base
from db.db_engine import engine, get_session, get_db
import db.models
from db.models.users import Users
from db.models.workflow_templates import WorkflowTemplates
from blocks import WorkflowTemplate
from tasks.catalog import TaskRegistry

# TODO Refactor code so that things that do not need to be here, arent here.
# Need to have their own files, modules and abstraction. This is a hack.
def create_tables():
    """Create all tables in the database if they don't already exist."""
    Base.metadata.create_all(bind=engine)
    
# Function to create a new user at startup if they don't already exist
def create_default_user(db_session: Session):
    """
    Create a default user in the database if they don't already exist.

    The default user is given the username 'default_user' and the email 'default_user@example.com'.

    This function is used at startup to create a default user if no users exist in the database.
    """
    default_username = "default_user"
    default_email = "default_user@example.com"

    # Check if the user already exists
    user = db_session.query(Users).filter_by(username=default_username).first()
    if not user:
        # User does not exist, so create a new one
        new_user = Users(username=default_username, email=default_email)
        db_session.add(new_user)
        try:
            db_session.commit()
            print(f"User '{default_username}' created successfully.")
        except IntegrityError:
            db_session.rollback()
            print(f"User '{default_username}' already exists.")
    else:
        print(f"User '{default_username}' already exists.")

def find_available_port(start_port:int=8001, end_port:int=9000):
    """ 
    Given a range of ports, find the first available one. This function
    is used to find an available port for the container to bind to.
    """
    for port in range(start_port, end_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            result = s.connect_ex(('localhost', port))
            if result != 0:
                return port
    raise RuntimeError("No available ports in the specified range")

def stop_docker_container(container_id: str):
    """Stop a docker container given a container id"""
    client = docker.from_env()
    container = client.containers.get(container_id)
    container.stop()

def delete_docker_container(container_id: str):
    """Delete a docker container given a container id"""
    client = docker.from_env()
    container = client.containers.get(container_id)
    container.remove()
    
def start_docker_container(image_id:str, host_port:int=8001):
    """
    Start a docker container given an image id. The container will be started detached and bind the port 8000 to the given host port.

    Args:
        image_id (str): The id of the docker image to use.
        host_port (int, optional): The host port to bind to. Defaults to 8001.

    Returns:
        docker.models.containers.Container: The started container.
    """
    client = docker.from_env()
    container = client.containers.run(
            image=image_id,
            ports={'8000/tcp': host_port},
            detach=True
            # TODO add name of the container
        )
    return container

def get_dependency_list_paths(payload):
    dependencies = []
    dependency_store_path = './tasks/dependencies'
    requirement_txt_files = os.listdir(dependency_store_path)
    requirement_txt_files = [f.replace('.txt', '') for f in requirement_txt_files]

    processes = payload['process']
    for process in processes:
        task_type = process['process_metadata']['process_type']
        if task_type in requirement_txt_files:
            dependencies.append(f'{dependency_store_path}/{task_type}.txt')
    return dependencies

def create_container_with_in_memory_dockerfile(payload):
    """
    Create a Docker container from the given payload by writing the payload
    as a JSON file directly into the container. The container will be started
    detached and will bind the port 8000 to a free port on the host. This is
    one of the core workings of the project, wherein for any given payload, we
    can spin up Docker containers.

    Args:
        payload (dict): The payload to write as a JSON file.

    Returns:
        tuple: A tuple containing the started container, the deployment URL,
        the Dockerfile content and the built image.
    """
    client = docker.from_env()
    json_payload = json.dumps(payload, indent=4)
    escaped_json_payload = json_payload.replace('"', '\\"').replace('\n', '\\n')

    # Create a temporary directory so that we can pass our app files to docker build context
    with tempfile.TemporaryDirectory() as temp_dir:
        # Copy the files from your working directory to the temporary directory for docker build context
        source_dir = os.getcwd()
        shutil.copytree(source_dir, os.path.join(temp_dir, 'app_files'), dirs_exist_ok=True)
        
        requirement_text_files = get_dependency_list_paths(payload)
        requirement_text_files_for_dockerfile = [path.replace(".", "/app", 1) for path in requirement_text_files]
        requirement_text_file_paths = " ".join([f"-r {path}" for path in requirement_text_files_for_dockerfile])

        # Create the Dockerfile content
        dockerfile_content = f"""
        FROM python:3.10-slim

        # Set the working directory
        WORKDIR /app

        # Copy existing FastAPI app code into the container
        COPY app_files /app

        # Install FastAPI and Uvicorn
        RUN pip install fastapi uvicorn
        RUN pip install {requirement_text_file_paths}

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
        host_port = find_available_port(8001, 9000)
        # Run the container
        container = start_docker_container(image_id=image.id, host_port=host_port)

        print(f"Container started with ID: {container.short_id}")
        # TODO: Make localhost configurable. Not everything will stay in localhost.
        deployment_url = f"http://localhost:{host_port}/workflow_run"
        print(f"Run workflow with: {deployment_url}")
        # TODO Make this better, such as a tuple
        return container, deployment_url, dockerfile_content, image
    
create_tables()

create_default_user(db_session=get_session())

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


@app.post("/create_workflow/")
async def create_workflow(request: Request, db_session: Session = Depends(get_db)):
    """Main endpoint that creates a new workflow and add a record to the database"""
    data = await request.json()
    default_user_id = 1
    workflow = WorkflowTemplate(**data['backend_template'])
    container, deployment_url, dockerfile_content, image = create_container_with_in_memory_dockerfile(workflow.dict())
    
    backend_template = json.dumps(data['backend_template'])
    frontend_template = json.dumps(data['frontend_template'])
    template_record = WorkflowTemplates(
        user_id=default_user_id, 
        name=data['workflow_name'], 
        description='Test Workflow', 
        backend_template=backend_template, 
        frontend_template=frontend_template,
        dockerfile_template=dockerfile_content,
        deployment_url=deployment_url,
        container_id=container.short_id,
        image_id=image.id
    )
    db_session.add(template_record)
    db_session.commit()
    template_id = template_record.id
    # TODO: Standard Server Response: Implement a standard response template
    return {
        "status": "success",
        "deployment_url": deployment_url,
        "template_id": template_id
    }
    
@app.get("/pause_workflow/{template_id}")
def pause_workflow(template_id: int, db_session: Session = Depends(get_db)):
    """
    Endpoint that pauses a workflow. A workflow is determined based on which template
    the user clicked on.
    """
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        stop_docker_container(container_id=template.container_id)
        delete_docker_container(container_id=template.container_id)
        # Empty deployment_url and container_id
        template.deployment_url = None
        template.container_id = None
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "deployment_url": None,
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")

@app.get("/resume_workflow/{template_id}")
def resume_workflow(template_id: int, db_session: Session = Depends(get_db)):
    """
    Endpoint that resumes a workflow. A workflow is determined based on which template
    the user clicked on.
    """
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        host_port = find_available_port(8001, 9000)
        container = start_docker_container(image_id=template.image_id, host_port=host_port)

        print(f"Container started with ID: {container.short_id}")
        # TODO: Make localhost configurable. Not everything will stay in localhost.
        deployment_url = f"http://localhost:{host_port}/workflow_run"
        template.deployment_url = deployment_url
        template.container_id = container.short_id
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "deployment_url": deployment_url,
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")
    
@app.get("/delete_workflow/{template_id}")
def delete_workflow(template_id: int, db_session: Session = Depends(get_db)):
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        stop_docker_container(container_id=template.container_id)
        delete_docker_container(container_id=template.container_id)
        db_session.delete(template)
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")


@app.get("/templates")
def get_templates(db_session: Session = Depends(get_db)):
    templates = db_session.query(WorkflowTemplates).all()
    for template in templates:
        template.backend_template = json.loads(template.backend_template)
        template.frontend_template = json.loads(template.frontend_template)
    # TODO: Standard Server Response: Implement a standard response template
    return templates

@app.get("/templates/{template_id}")
def get_template(template_id: int, db_session: Session = Depends(get_db)):
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        template.backend_template = json.loads(template.backend_template)
        template.frontend_template = json.loads(template.frontend_template)
        # TODO: Standard Server Response: Implement a standard response template
        return template
    else:
        raise HTTPException(status_code=404, detail="Template not found")

@app.get("/get_block_types")
def get_block_types():
    block_types = TaskRegistry.get_task_registry()
    # TODO: Standard Server Response: Implement a standard response template
    return block_types

