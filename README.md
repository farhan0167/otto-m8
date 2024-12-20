<div>
    <div class='otto-logo-div' align="center" style="margin-bottom: 0px;">
        <img class='otto-logo' width='980px' src='docs/assets/otto-m8.png' style="border-radius: 5px;">
    </div>
    <h1 align="center">otto-m8</h1>
    <p align="center">A Flowchart based automation platform to run deep learning workloads with minimal to no code.</p>
    <p>otto-m8 (automate) lets users spin up a wide range of AI models, starting from Traditional deep learning models to large language models, all through a flowchart like user interface. At its core, otto-m8 will deploy a Docker container of your workflow that you can use as an API to integrate with your existing workflows, build a AI assistant chatbot or use it as a standalone API/application.</p>
    <p>The idea is simple-provide a easy-to-use user interface to spin up AI models. A lot of code needed to run AI models(both LLMs and traditional deep learning models)
    are boilerplate code blocks, including the deployments which is more often than not a REST API serving the model. The goal of otto-m8 is not only to abstract that through code
    but to abstract the entire process into a UI. Otto-m8 operates with a Input, Process, Output paradigm, where every flow has some form of input, that gets processed via a series of processes, and then an output.</p>
    <p>This is currently an MVP and made source available, which is to say this is not an Open Source software.</p>
</div>

## Getting Started

1. Pre-req: Make sure to have Docker or Docker Desktop Installed on your computer, and in order to run Ollama blocks, make sure you have the Ollama server running in the background.
2. Run the following command to make `run.sh` executable
```bash
chmod +x run.sh
```
1. Then launch the application:
```bash
./run.sh
```
This should launch both the dashboard and the server. To access the dashboard, head over to `http://localhost:3000/`. Use the default login credentials to access the dashboard, and get started on your first workflow.

## Examples

### OpenAI Langchain PDF Parsing
Below is an example of a workflow that incorporates Langchain's PDF Parser to build a workflow:
![langchain_pdf_parse](/docs/assets/amazon.gif)

To run it as an API:
```python
import requests
import base64
import json

# Find the deployment URL on the Template page
deployment_url = "http://localhost:8001/workflow_run"

path_to_pdf = "./AMZN-Q1-2024-Earnings-Release.pdf"

# Any kind of upload documents expect a base64 encoded string.
with open(path_to_pdf, "rb") as f:
    data = f.read()
    data_base64 = base64.b64encode(data).decode("utf-8")

# Based on the Block's displayed name, append your data:
payload = {
    "Langchain_PDF_Parser": data_base64,
    "Input_Block": "What was amazon's net sales?"
}

request = requests.post(
    deployment_url, 
    json={"data": payload}
)
response = request.json()['message']
response = json.loads(response)
print(response)
"""
Output:
{
  "f92cffae-14d2-43f4-a961-2fcd5829f1bc": {
    "id": "chatcmpl-AgOrZExPgef0TzHVGNVJJr1vmrJyR",
    "choices": [
      {
        "finish_reason": "stop",
        "index": 0,
        "logprobs": null,
        "message": {
          "content": "In the first quarter of 2024, Amazon's net sales increased by 13% to $143.3 billion, compared with $127.4 billion in the first quarter of 2023.",
          "refusal": null,
          "role": "assistant",
          "function_call": null,
          "tool_calls": null
        }
      }
    ],
    "created": 1734668713,
    "model": "gpt-4o-mini-2024-07-18",
    "object": "chat.completion",
    "service_tier": null,
    "system_fingerprint": "fp_0aa8d3e20b",
    "usage": {
      "completion_tokens": 42,
      "prompt_tokens": 13945,
      "total_tokens": 13987,
      "completion_tokens_details": {
        "audio_tokens": 0,
        "reasoning_tokens": 0,
        "accepted_prediction_tokens": 0,
        "rejected_prediction_tokens": 0
      },
      "prompt_tokens_details": {
        "audio_tokens": 0,
        "cached_tokens": 13824
      }
    },
    "conversation": [
      {
        "role": "user",
        "content": "What was amazon's net sales?"
      },
      {
        "role": "assistant",
        "content": "In the first quarter .."
      }
    ]
  }
}
"""
```

#### Chatbot
Use the Chat Output block to use the chat interface:
![chatbot](/docs/assets/chatbot.gif)

### Huggingface Multimodal
You can run almost any Huggingface model(although not really) that can be run via
Huggingface's pipeline abstraction. Below is a simple demo of the `Salesforce/blip-image-captioning-base` model.
![hf_multimodal_demo](/docs/assets/hf_multimodal.gif)