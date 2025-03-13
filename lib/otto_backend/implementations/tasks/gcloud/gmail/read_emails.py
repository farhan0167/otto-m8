import json
import base64
import email

from googleapiclient.discovery import build

from implementations.base import (
    BaseImplementation,
    BlockMetadata,
    Field,
    FieldType,
    StaticDropdownOption
)
from integrations.gcloud.auth_flow import get_credentials

class GmailReadEmails(BaseImplementation):
    display_name = "Gmail Read Emails"
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
                'service': 'gmail',
                'options': [
                    StaticDropdownOption(
                        label='Read Only',
                        value='https://www.googleapis.com/auth/gmail.readonly'
                    ).__dict__,
                    StaticDropdownOption(
                        label='Modify',
                        value='https://www.googleapis.com/auth/gmail.modify'
                    ).__dict__,
                ],
                "selected_options": []
            }
        ),
        Field(name='num_emails', display_name="Limit", is_run_config=True, show_in_ui=False, type=FieldType.NUMBER.value, default_value=10),
    ])
    
    def __init__(self, run_config:dict=None) -> None:
        super().__init__()
        self.run_config = run_config
        
        
    def run(self, input_:dict=None):
        
        creds = get_credentials()
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        results = service.users().messages().list(
            userId="me", 
            maxResults=self.run_config.get('num_emails', 3),
            labelIds=["INBOX"]
        ).execute()
        messages = results.get("messages", [])
        
        response = []
        if not messages:
            return []
        for message in messages:
            msg = service.users().messages().get(userId="me", id=message["id"], format="raw").execute()
            raw_message = base64.urlsafe_b64decode(msg["raw"].encode("UTF-8"))
            email_msg = email.message_from_bytes(raw_message)
            
            subject = email_msg["Subject"]
            sender = email_msg["From"]
            message_body = ""
            
            if email_msg.is_multipart():
                for part in email_msg.walk():
                    ctype = part.get_content_type()
                    cdispo = str(part.get("Content-Disposition"))
                    if ctype == "text/plain" and "attachment" not in cdispo:
                        message_body = part.get_payload(decode=True).decode("utf-8")  # type: ignore[union-attr]
                        break
            else:
                message_body = email_msg.get_payload(decode=True).decode("utf-8")  # type: ignore[union-attr]

            response.append({
                "subject": subject,
                "sender": sender,
                "body": message_body
            })
       
        
        return response