import json

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
    payload: CreateDraftWorkflowRequest,
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    """Endpoint to create a temporary workflow that users can edit."""
    payload = payload.payload
    draft_template = DraftTemplate(
        user_id=current_user.id, 
        name=payload['name'], 
        description=payload['description'], 
        frontend_template=json.dumps(payload['frontend_template'])
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
def get_draft_workflows(
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    drafts = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id
    ).all()
    response = []
    for draft in drafts:
        response.append({
            "id": draft.id,
            "name": draft.name,
            "description": draft.description,
            "template": json.loads(draft.frontend_template),
            "reference_template_id": draft.reference_template_id
        })
    
    return response
    
@router.get("/get_draft_workflow/{template_id}", tags=["Draft Workflows/Templates"])
def get_draft_workflow(
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
        return template
    else:
        raise HTTPException(status_code=404, detail="Template not found")
    
    
@router.get("/delete_draft_workflow/{template_id}", tags=["Draft Workflows/Templates"])
def delete_draft_workflow(
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

@router.get("/update_draft_workflow/{template_id}", tags=["Draft Workflows/Templates"])
def update_draft_workflow(
    template_id: int, 
    payload: dict,
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    template = db_session.query(DraftTemplate).filter(
        DraftTemplate.user_id == current_user.id,
        DraftTemplate.id == template_id
    ).first()
    if template:
        template.name = payload['name']
        template.description = payload['description']
        template.frontend_template = json.dumps(payload['frontend_template'])
        db_session.commit()
        # TODO: Standard Server Response: Implement a standard response template
        return {
            "status": "success",
            "template_id": template_id
        }
    else:
        raise HTTPException(status_code=404, detail="Template not found")

    
