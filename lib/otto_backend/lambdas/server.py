from fastapi import FastAPI
from pydantic import BaseModel

import handler

app = FastAPI()

class LambdaRequest(BaseModel):
    event: dict
    context: dict


@app.post("/run")
def run_handler(request: LambdaRequest):
    event, context = request.event, request.context
    output = handler.handler(event, context)
    return output
