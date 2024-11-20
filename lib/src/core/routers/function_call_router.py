from pydantic import BaseModel
from fastapi import HTTPException, APIRouter

router = APIRouter()

class LocationRequest(BaseModel):
    location: str

@router.post("/test", tags=["Functions"])
async def test(location: LocationRequest):
    dummy_temperatures = {
        "san francisco": 68,
        "new york": 75,
        "london": 60,
        "tokyo": 80,
        "paris": 65,
        "dhaka": 70
    }
    # Convert location to lowercase for case-insensitive matching
    location = location.location.lower()

    # Check if the location exists in the dummy data
    if location in dummy_temperatures:
        temperature = dummy_temperatures[location]
        return {"location": location.title(), "temperature": temperature}
    else:
        # Return a 404 if the location is not found
        raise HTTPException(status_code=404, detail="Location not found")