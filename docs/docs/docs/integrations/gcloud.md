---
title: Google Cloud
sidebar_position: 1
---

The Google Cloud integrations allow you to access Google services such as Gmail, Sheets, Drive, etc.

## Setup

### Get credentials

In order to use the services, you need make sure you have a `credentials.json` file saved. Follow
the steps in this [documentation](https://developers.google.com/gmail/api/quickstart/python#authorize_credentials_for_a_desktop_application) 
to get the credentials set up.

With the `credentials.json` file, place it within `otto_backend/.cache/gcloud/` directory.

### Configuring the OAuth Consent Screen

If you're using a new Google Cloud project to complete this quickstart, configure the OAuth consent screen, using
the [documentation](https://developers.google.com/calendar/api/quickstart/python#configure_the_oauth_consent_screen) here.

### Enable the API's

Once you got the `credentials.json` file in place, you'll need to enable the Google Cloud services to be able to use them.

#### Available Integrations

The following integrations are currently available:
- **Gmail**: reading emails, creating drafts, and sending emails.
    - Enable API here: https://console.cloud.google.com/flows/enableapi?apiid=gmail.googleapis.com
- **Calendar**: reading events, and creating events.
    - Enable API here: https://console.cloud.google.com/flows/enableapi?apiid=calendar-json.googleapis.com

### Notes on Configuring the OAuth Consent Screen

When configuring the OAuth Consent Screen as per the documentation, if you select Audience as External, then you should
make sure you add Test Users or else you will not be able to use the app.