import json


from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session

from db.db_engine import get_db
from db.models import TracerDBModel, Users
from routers.dependency import get_current_user

router = APIRouter()

@router.get("/trace/{id}", tags=["Tracer"])
async def get_trace(
    id: int, 
    db_session: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # filter by user id and template id
    traces = db_session.query(TracerDBModel).filter(
        TracerDBModel.user_id == current_user.id,
        TracerDBModel.template_id == id
    ).all()
    response = []
    if traces:
        # TODO: Standard Server Response: Implement a standard response template
        for trace in traces:
            response.append({
                "start_timestamp": trace.start_timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "end_timestamp": trace.end_timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "execution_time": round(trace.execution_time, 2),
                "log": trace.log
            })
        return response
    else:
        return []    
