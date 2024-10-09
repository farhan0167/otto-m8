from integrations.http.post_requests.post_request import HTTPPostRequest
import json

run_config={
    'method': 'POST',
    'endpoint': 'http://localhost:8000/test'
}

intg = HTTPPostRequest(run_config=run_config)

payload = '''{
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7
}'''

#print(json.loads(payload))
print(intg.run(payload))