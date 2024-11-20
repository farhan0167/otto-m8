import json
import tempfile
import os
import shutil

import docker
from fastapi import APIRouter, Request, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.db_engine import get_db
from db.models.lambdas import Lambdas
from db.models.users import Users
from core.container_utils.docker_tools import DockerTools
from core.routers.dependency import get_current_user

router = APIRouter()

class CreateLambdaPayload(BaseModel):
    lambda_name: str
    code: str


@router.post("/create_lambda/", tags=["Lambdas"])
async def create_lambda(
    request: CreateLambdaPayload,
    db_session: Session = Depends(get_db),
):
    """Main endpoint that creates a new workflow and add a record to the database"""
    code, lambda_name = request.code, request.lambda_name
    container, deployment_url, image = create_container_with_in_memory_dockerfile(code, lambda_name)
    lambda_record = Lambdas(
        name=lambda_name, 
        code=code, 
        deployment_url=deployment_url,
        container_id=container.short_id,
        image_id=image.id
    )
    db_session.add(lambda_record)
    db_session.commit()
    return lambda_record

@router.get("/get_lambdas", tags=["Lambdas"])
async def get_lambdas(db_session: Session = Depends(get_db)):
    lambdas = db_session.query(Lambdas).all()
    return lambdas

@router.get("/get_lambda/{lambda_id}", tags=["Lambdas"])
async def get_lambda_by_id(lambda_id: int, db_session: Session = Depends(get_db)):
    lambda_record = db_session.query(Lambdas).filter(Lambdas.id == lambda_id).first()
    if lambda_record:
        return lambda_record
    else:
        raise HTTPException(status_code=404, detail="Lambda not found")

@router.get("/get_lambda_by_name/{lambda_name}", tags=["Lambdas"])
async def get_lambda_by_name(lambda_name: str, db_session: Session = Depends(get_db)):
    lambda_record = db_session.query(Lambdas).filter(Lambdas.name == lambda_name).first()
    if lambda_record:
        return lambda_record
    else:
        raise HTTPException(status_code=404, detail="Lambda not found")
    
@router.get("/delete_lambda/{lambda_id}", tags=["Lambdas"])
async def delete_lambda(lambda_id: int, db_session: Session = Depends(get_db)):
    lambda_record = db_session.query(Lambdas).filter(Lambdas.id == lambda_id).first()
    if lambda_record:
        DockerTools.stop_docker_container(container_id=lambda_record.container_id)
        DockerTools.delete_docker_container(container_id=lambda_record.container_id)
        db_session.delete(lambda_record)
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "lambda_id": lambda_id
        }
    else:
        raise HTTPException(status_code=404, detail="Lambda not found")
    
@router.post("/update_lambda/{lambda_id}", tags=["Lambdas"])
async def update_lambda(lambda_id: int, request: CreateLambdaPayload, db_session: Session = Depends(get_db)):
    # First delete the current lambda container
    lambda_record = db_session.query(Lambdas).filter(Lambdas.id == lambda_id).first()
    if lambda_record:
        DockerTools.stop_docker_container(container_id=lambda_record.container_id)
        DockerTools.delete_docker_container(container_id=lambda_record.container_id)
    # Then create a new container with the new code
    code, lambda_name = request.code, request.lambda_name
    container, deployment_url, image = create_container_with_in_memory_dockerfile(code, lambda_name)
    if lambda_record:
        lambda_record.code = code
        lambda_record.deployment_url = deployment_url
        lambda_record.image_id = image.id
        lambda_record.container_id = container.short_id
        db_session.commit()
        return lambda_record
    
    


def create_container_with_in_memory_dockerfile(code, lambda_name):
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

        # Create a temporary directory so that we can pass our app files to docker build context
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy the files from your working directory to the temporary directory for docker build context
            source_dir = os.getcwd()
            lambdas_dir = os.path.join(source_dir, "lambdas")
            shutil.copytree(lambdas_dir, os.path.join(temp_dir, 'app_files'), dirs_exist_ok=True)
            
            with open(os.path.join(temp_dir, 'app_files', 'handler.py'), 'w') as f:
                f.write(code)

            # Build the Docker image from the temporary directory
            image, _ = client.images.build(
                path=os.path.join(temp_dir, 'app_files'),
                # TODO add a field to the blocks for Workflow such that we can get name of the image based on payload
                tag=f"otto-m8-lambdas-{lambda_name}",
                rm=True
            )
            host_port = DockerTools.find_available_port(9000,10000)
            # Run the container
            container = DockerTools.start_docker_container(image_id=image.id, host_port=host_port)

            print(f"Container started with ID: {container.short_id}")
            # TODO: Make localhost configurable. Not everything will stay in localhost.
            deployment_url = f"http://localhost:{host_port}/run"
            print(f"Run Lambdas with: {deployment_url}")
            # TODO Make this better, such as a tuple
            return container, deployment_url, image