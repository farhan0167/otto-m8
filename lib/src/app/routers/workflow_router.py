import json

from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db_engine import get_db
from db.models.workflow_templates import WorkflowTemplates
from db.models.users import Users
from blocks import WorkflowTemplate
from app.container_utils.docker_tools import DockerTools
from app.routers.dependency import get_current_user

router = APIRouter()

@router.post("/create_workflow/", tags=["Workflows"])
async def create_workflow(
    request: Request, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """Main endpoint that creates a new workflow and add a record to the database"""
    data = await request.json()
    user_id = current_user.id
    backend_template = {
        "workflow_name": data['workflow_name'],
        **data['backend_template']
    }
    workflow = WorkflowTemplate(**backend_template)
    (container, 
     deployment_url, 
     dockerfile_content, 
     image
    ) = DockerTools.create_container_with_in_memory_dockerfile(workflow.dict())
    
    backend_template = json.dumps(workflow.dict())
    frontend_template = json.dumps(data['frontend_template'])
    template_record = WorkflowTemplates(
        user_id=user_id, 
        name=data['workflow_name'], 
        description=data['workflow_description'], 
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
    
@router.get("/pause_workflow/{template_id}", tags=["Workflows"])
def pause_workflow(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """
    Endpoint that pauses a workflow. A workflow is determined based on which template
    the user clicked on.
    """
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        DockerTools.stop_docker_container(container_id=template.container_id)
        DockerTools.delete_docker_container(container_id=template.container_id)
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

@router.get("/resume_workflow/{template_id}", tags=["Workflows"])
def resume_workflow(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """
    Endpoint that resumes a workflow. A workflow is determined based on which template
    the user clicked on.
    """
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        host_port = DockerTools.find_available_port(8001, 9000)
        container = DockerTools.start_docker_container(image_id=template.image_id, host_port=host_port)

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
    
@router.get("/delete_workflow/{template_id}", tags=["Workflows"])
def delete_workflow(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    template = db_session.query(WorkflowTemplates).filter(WorkflowTemplates.id == template_id).first()
    if template:
        DockerTools.stop_docker_container(container_id=template.container_id)
        DockerTools.delete_docker_container(container_id=template.container_id)
        db_session.delete(template)
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")