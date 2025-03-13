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

SERVICE = "gmail"
DEFAULT_SCOPE = "https://www.googleapis.com/auth/gmail.readonly"

class GmailSendEmail(BaseImplementation):
    display_name = "Gmail Send Email"
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
                        value='https://www.googleapis.com/auth/gmail.readonly'
                    ).__dict__,
                    StaticDropdownOption(
                        label='Full Access',
                        value='https://mail.google.com/'
                    ).__dict__,
                ],
                "selected_options": []
            }
        ),
        Field(
            name="from",
            display_name="From",
            is_run_config=True,
            show_in_ui=False,
            type=FieldType.TEXT.value
        )
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        self.run_config = run_config
        
        
    def run(self, input_:dict=None):
        
        # Assuming only one block passes the input
        input_ = list(input_.values())[0]
        input_ = json.loads(input_)
        subject = input_.get('subject')
        body = input_.get('body')
        to = input_.get('to')
        
        
        scopes = self.run_config.get('scopes', [DEFAULT_SCOPE])
        creds = get_credentials(
            scopes=scopes,
            service=SERVICE
        )
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        
        message = MIMEText(body)
        message["to"] = to
        message["subject"] = subject
        message["from"] = self.run_config.get('from')

        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        
        send_message = {
            "raw": raw_message
        }
        
        try:
            email_response = service.users().messages().send(
                userId="me",
                body=send_message
            ).execute()
            print(f"Draft created with ID: {email_response['id']}")
            return {
                "email_response": email_response,
                "message": "Email sent successfully"
            }
        except Exception as e:
            print(f"Error creating draft: {e}")
            return {
                "email_response": None,
                "message": f"Error sending email: {e}"
            }
        