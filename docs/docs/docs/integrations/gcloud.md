---
title: Google Cloud
sidebar_position: 1
---

The Google Cloud integrations allow you to access Google services such as Gmail, Sheets, Drive, etc.

### Setup

In order to use the services, you need make sure you have a `credentials.json` file saved. Follow
the steps in this [documentation](https://developers.google.com/gmail/api/quickstart/python#authorize_credentials_for_a_desktop_application) 
to get the credentials set up.

With the `credentials.json` file, place it within `otto_backend/.cache/gcloud/` directory.

### Available Integrations

The following integrations are currently available:
- **Gmail**: reading emails, creating drafts, and sending emails.
- **Calendar**: reading events, and creating events.