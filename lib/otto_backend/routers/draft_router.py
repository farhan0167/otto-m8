import json
import datetime

from pydantic import BaseModel
from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db_engine import get_db
from db.models import WorkflowTemplates, Users, DraftTemplate
from core.container_utils.docker_tools import DockerTools
from routers.dependency import get_current_user

router = APIRouter()


class CreateDraftWorkflowRequest(BaseModel):
    payload: dict
    
@router.post("/create_draft_workflow", tags=["Draft Workflows/Templates"])
async def create_draft_workflow(
    request: CreateDraftWorkflowRequest,
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """Endpoint to create a temporary workflow that users can edit."""
    payload = request.payload
    frontend_template = {
        "nodes": payload['nodes'],
        "edges": payload['edges']
    }
    reference_template_id = payload.get('reference_template_id', None)
    draft_template = DraftTemplate(
        user_id=current_user.id, 
        name=payload['name'], 
        description=payload['description'], 
        frontend_template=json.dumps(frontend_template),
        reference_template_id=reference_template_id,
        date_created=datetime.datetime.now(),
        date_modified=datetime.datetime.now()
    )
    db_session.add(draft_template)
    db_session.commit()
    template_id = draft_template.id
    # TODO: Standard Server Response: Implement a standard response template
    return {
        "status": "success",
        "template_id": template_id
    }

@router.get("/get_draft_workflows", tags=["Draft Workflows/Templates"])
async def get_draft_workflows(
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    drafts = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id
    ).all()
    response = []
    for draft in drafts:
        frontend_template = json.loads(draft.frontend_template)

        response.append({
            "id": draft.id,
            "name": draft.name,
            "description": draft.description,
            "nodes": frontend_template['nodes'],
            "edges": frontend_template['edges'],
            "reference_template_id": draft.reference_template_id,
            "date_created": draft.date_created.strftime("%m-%d-%Y %H:%M:%S"),
            "date_modified": draft.date_modified.strftime("%m-%d-%Y %H:%M:%S")
        })
    
    return response
    
@router.get("/get_draft_workflow/{template_id}", tags=["Draft Workflows/Templates"])
async def get_draft_workflow(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    template = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id,
        DraftTemplate.id == template_id
    ).first()
    if template:
        # TODO: Standard Server Response: Implement a standard response template
        frontend_template = json.loads(template.frontend_template)
        return {
            "id": template.id,
            "name": template.name,
            "description": template.description,
            "nodes": frontend_template['nodes'],
            "edges": frontend_template['edges'],
            "reference_template_id": template.reference_template_id,
            "date_created": template.date_created.strftime("%m-%d-%Y %H:%M:%S"),
            "date_modified": template.date_modified.strftime("%m-%d-%Y %H:%M:%S")
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")
    
@router.get("/draft_exists/{reference_template_id}", tags=["Draft Workflows/Templates"])
async def draft_exists(
    reference_template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    template = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id,
        DraftTemplate.reference_template_id == reference_template_id
    ).first()
    if template:
        frontend_template = json.loads(template.frontend_template)
        return {
                "exists": True,
                "template": {
                "id": template.id,
                "name": template.name,
                "description": template.description,
                "nodes": frontend_template['nodes'],
                "edges": frontend_template['edges'],
                "reference_template_id": template.reference_template_id
            }
        }
    else:
        return {
            "exists": False,
            "template": None
        }
    
    
@router.get("/delete_draft_workflow/{template_id}", tags=["Draft Workflows/Templates"])
async def delete_draft_workflow(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    template = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id,
        DraftTemplate.id == template_id
    ).first()
    if template:
        db_session.delete(template)
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")
    
class UpdateDraftWorkflowRequest(BaseModel):
    payload: dict
    template_id: int   

@router.post("/update_draft_workflow", tags=["Draft Workflows/Templates"])
async def update_draft_workflow(
    request: UpdateDraftWorkflowRequest,
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    template = request.payload
    frontend_template = {
        "nodes": request.payload['nodes'],
        "edges": request.payload['edges']
    }
    # filter by user id and template id
    template = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id,
        DraftTemplate.id == request.template_id
    ).first()
    if template:
        template.name = request.payload['name']
        template.description = request.payload['description']
        template.frontend_template = json.dumps(frontend_template)
        template.date_modified = datetime.datetime.now()
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "template_id": request.template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")

    
