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

class GoogleCalendarUpcomingEvents(BaseImplementation):
    display_name = "Get Upcoming Events"
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
            name='max_results',
            display_name="Max Results",
            is_run_config=True,
            show_in_ui=False,
            type=FieldType.NUMBER.value,
            default_value=10
        ),
        Field(
            name='time_min',
            display_name="Time Min",
            is_run_config=True,
            show_in_ui=False,
            type=FieldType.DATETIME.value,
            default_value="2025-01-01T00:00:00Z"
        ),
        Field(
            name='order_by',
            display_name="Order By",
            is_run_config=True,
            show_in_ui=False,
            type=FieldType.STATIC_DROPDOWN.value,
            default_value='startTime',
            metadata={
                'dropdown_options': [
                    StaticDropdownOption(value='startTime', label="Start Time").__dict__,
                    StaticDropdownOption(value='updated', label="Last Updated").__dict__,
                ],
            }
        )
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        self.run_config = run_config
        self.max_results = run_config.get('max_results')
        self.time_min = run_config.get('time_min')
        self.order_by = run_config.get('order_by')
        
        
    def run(self, input_:dict=None):
        scopes = self.run_config.get('scopes', [DEFAULT_SCOPE])
        creds = get_credentials(
            scopes=scopes,
            service=SERVICE
        )
        
        # Assuming only one block passes the input
        input_ = list(input_.values())[0]
        input_ = json.loads(input_)
        
        max_results = input_.get('max_results', self.max_results)
        time_min = input_.get('time_min', self.time_min)
        order_by = input_.get('order_by', self.order_by)
        
        service = build("calendar", "v3", credentials=creds)
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                maxResults=max_results,
                singleEvents=True,
                orderBy=order_by,
                timeMin=time_min  # Optional: Set a specific start time
            )
            .execute()
        )
        events = events_result.get("items", [])

        if not events:
            print("No upcoming events found.")
            return []

        return events
        
        
        