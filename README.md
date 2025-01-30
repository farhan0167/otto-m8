<div>
    <div class='otto-logo-div' align="center" style="margin-bottom: 0px;">
        <img class='otto-logo' width='980px' src='docs/assets/otto-m8.png' style="border-radius: 5px;">
    </div>
    <h1 align="center">otto-m8</h1>
    <p align="center">An open source Flowchart based automation platform to run deep learning workloads with minimal to no code.</p>
</div>

## ♾️ Wait, what is Otto-m8?

otto-m8 (automate) is a low code platform that allows users to build AI/ML workflows through a flowchart like UI. To be more specific, its a platform that aims to abstract away the code needed to launch deep learning based workflows, where a workflow could mean just using an AI model by itself, or integrating with other third party API's. 

Imagine the following scenario: you have trained a deep learning model and pushed the model to Huggingface Hub. While you could potentially host your model using their Inference API, you want to integrate your model with a LLM or some other function to make your model useful. This is where otto-m8 comes in by:
1) Allowing you to chain your model with other models and integrations visually, which we'll call a workflow.
2) Serve that workflow as a REST API that other users could consume from.

To take it a step further, consider otto-m8 as a visual infrastructure platform that creates a deployable docker container hosting your ML model and business logic. 

## 🚀 Getting Started

### Prerequisite: 
1. Make sure to have Docker or Docker Desktop Installed on your computer.
2. In order to run Ollama blocks, make sure you have the Ollama server running in the background. 
3. Ensure you have poetry installed in your system:
```
curl -sSL https://install.python-poetry.org | python3 -
```
Once installation is complete, make sure to export poetry to PATH. This instruction should appear once you install poetry via the command above.
4. This project was built using Python `3.11.4`, and it is recommended that you run it on the same version but you can also run this with versions `>=3.10,<3.13`. In case of any hiccups, please raise an [issue](https://github.com/farhan0167/otto-m8/issues).

### Run the project
1. Run the following command to make `run.sh` executable
```bash
chmod +x run.sh
```
2. Then launch the application:
```bash
./run.sh
```
This should launch both the dashboard and the server. To access the dashboard, head over to `http://localhost:3000/`. Use the default login credentials to access the dashboard, and get started on your first workflow.

## 🛠️ Documentation
Please see [here](https://otto-m8.com/) for full documentation, including:
- [Introduction](https://otto-m8.com/docs/introduction): Overview of the platform
- [Conceptual-Guide](https://otto-m8.com/docs/category/conceptual-guide): The core concepts that went behind building otto-m8
- [Tutorials](https://otto-m8.com/docs/category/tutorials): If you want to see what you can build with otto-m8, this guide is what you're looking for.

## 🔍 Examples

### OpenAI Langchain PDF Parsing
Below is an example of a workflow that incorporates Langchain's PDF Parser to build a workflow:
![langchain_pdf_parse](/docs/assets/amazon.gif)

#### To run with the sdk:

- Install the library:
```
pip install otto-m8
```

- And then run:

```python
import base64
import json
from otto_m8.run import OttoRun

# Assuming your workflow is running on port 8001
otto = OttoRun(workflow_url='http://localhost:8001/workflow_run')

path_to_pdf = "./AMZN-Q1-2024-Earnings-Release.pdf"
# Any kind of upload documents expect a base64 encoded string.
with open(path_to_pdf, "rb") as f:
    data = f.read()
    data_base64 = base64.b64encode(data).decode("utf-8")

# Based on the Block's displayed name(`id` on Block config tab), append your data:
payload = {
    "Langchain_PDF_Parser": data_base64,
    "Input_Block": "What was amazon's net sales?"
}

response = otto.run(payload)
print(response)
```

#### To run it using the Request libray:
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

# Based on the Block's displayed name(`id` on Block config tab), append your data:
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
```

```python
Output:
"""
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

## Roadmap
- [x] Basic Chatbot and HF workflows
- [x] Function Calling
- [x] Lambda Functions/ Custom Code blocks
- [x] Multimodality for Huggingface
- [ ] Multimodality for OpenAI
- [x] SDK for interacting with deployed workflows
- [x] Observability for every block's output like a Logger
- [ ] Memory for Chatbot and RAG. Goal is to not clutter the drawing board.
- [x] Streamline workflow creation, edits and redeployment. Some form of version control
- [ ] Apart from Lambdas that deploy seperate docker containers for custom code, build a custom code block which is deployed within the workflow container.
- [ ] ML Model Training via UI?


## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](https://github.com/farhan0167/otto-m8/blob/main/LICENSE) file for details.