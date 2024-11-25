import json


from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db_engine import get_db
from db.models.workflow_templates import WorkflowTemplates
from db.models.users import Users
from routers.dependency import get_current_user

router = APIRouter()

@router.get("/templates", tags=["Templates"])
def get_templates(
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    user_id = current_user.id
    templates = db_session.query(WorkflowTemplates).filter(
        WorkflowTemplates.user_id == user_id
    ).all()
    for template in templates:
        template.backend_template = json.loads(template.backend_template)
        template.frontend_template = json.loads(template.frontend_template)
    # TODO: Standard Server Response: Implement a standard response template
    return templates

@router.get("/templates/{template_id}", tags=["Templates"])
def get_template(
    template_id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    template = db_session.query(WorkflowTemplates).filter(
        WorkflowTemplates.user_id == current_user.id,
        WorkflowTemplates.id == template_id
    ).first()
    if template:
        template.backend_template = json.loads(template.backend_template)
        template.frontend_template = json.loads(template.frontend_template)
        # TODO: Standard Server Response: Implement a standard response template
        return template
    else:
        raise HTTPException(status_code=404, detail="Template not found")