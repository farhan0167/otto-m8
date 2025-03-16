import json
import base64
from email.mime.text import MIMEText

from googleapiclient.discovery import build

from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType,
    StaticDropdownOption
)
from integrations.gcloud.auth_flow import get_credentials

SERVICE = "calendar"
DEFAULT_SCOPE = "https://www.googleapis.com/auth/calendar.readonly"

class GoogleCalendarCreateEvent(BaseImplementation):
    display_name = "Create Event"
    block_type = 'process'
    block_metadata = BlockMetadata([
        Field(
            name="gcloud_auth_flow",
            display_name="Sign in with Google",
            is_run_config=True,
            default_value=None,
            show_in_ui=False,
            type=FieldType.GCLOUD_AUTH.value,
            metadata={
                'service': SERVICE,
                'options': [
                    StaticDropdownOption(
                        label='Read Only',
                        value='https://www.googleapis.com/auth/calendar.readonly'
                    ).__dict__,
                    StaticDropdownOption(
                        label='Full Access',
                        value='https://www.googleapis.com/auth/calendar'
                    ).__dict__,
                ],
                "selected_options": []
            }
        ),
        Field(
            name='timezone',
            display_name="Timezone",
            is_run_config=True,
            show_in_ui=True,
            default_value='America/New_York',
            type=FieldType.TEXT.value
        )
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        self.run_config = run_config
        self.timezone = run_config.get('timezone')
        
        
    def run(self, input_:dict=None):
        scopes = self.run_config.get('scopes', [DEFAULT_SCOPE])
        creds = get_credentials(
            scopes=scopes,
            service=SERVICE
        )
        
        # Assuming only one block passes the input
        input_ = list(input_.values())[0]
        input_ = json.loads(input_)
        
        summary = input_.get('summary')
        location = input_.get('location')
        description = input_.get('description')
        start_time = input_.get('start_time')
        end_time = input_.get('end_time')
        
        service = build("calendar", "v3", credentials=creds)
        
        event = {
            "summary": summary,
            "location": location,
            "description": description,
            "start": {
                "dateTime": start_time,  # Format: "2025-03-20T10:00:00-07:00"
                "timeZone": self.timezone,
            },
            "end": {
                "dateTime": end_time,  # Format: "2025-03-20T11:00:00-07:00"
                "timeZone": self.timezone,
            },
            "reminders": {
                "useDefault": True,
                #"overrides": [{"method": "email", "minutes": 24 * 60}, {"method": "popup", "minutes": 10}],
            },
        }
        
        try:
            event = service.events().insert(calendarId="primary", body=event).execute()
            print(f"Event created: {event.get('htmlLink')}")
            return {
                "event": event,
                "message": f"Event created: {event.get('htmlLink')}"
            }
        except Exception as e:
            print(f"Error creating event: {e}")
            return {
                "event": None,
                "message": f"Error creating event: {e}"
            }
        