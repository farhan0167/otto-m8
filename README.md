<div>
    <div class='otto-logo-div' align="center" style="margin-bottom: 0px;">
        <img class='otto-logo' width='980px' src='docs/assets/otto-m8.png' style="border-radius: 5px;">
    </div>
    <h1 align="center">otto-m8</h1>
    <p align="center">An open source Flowchart based automation platform to run deep learning workloads with minimal to no code.</p>
</div>

## ♾️ Wait, what is Otto-m8?

otto-m8 (automate) is a low code platform that allows users to build AI/ML workflows through a flowchart like UI. In other words, you can visually declare how you build AI workflows or agents. Its low code because you are still in control over the implementation of a block(yes you can not only add custom blocks but also modify out of the box blocks), and more importantly, its a platform that isn't specifically built on top of an existing AI framework like Langchain. What this means is that, you can build you workflows with any framework you see fit, whether it is Langchain, Llama Index or the AI providers sdk themselves.

At its core, otto-m8 views the problem of building any AI workflow as a graph problem. As developers, we mostly build modular components where each components are responsible for a specific task (consider them as nodes), and each component sends data between each other (the edges). Together you get a workflow which consists of inputs, some transformations of the inputs(we'll call them processes), and an output.

This project is still in its early phase. What will make this platform successful is the number of integrations we can provide, but more than that, what will make this project successful is if we can circumvent the limitations of low code platforms, which is-they don't scale. To overcome this, otto-m8 is released as a fully open source platform and community contributions will be greatly appreciated. For contributions, see the [CONTRIBUTION.md](CONTRIBUTING.md) for guidelines.

![demo](https://farhan0167-otto-m8.s3.us-east-1.amazonaws.com/new_demo2.gif)

### Key Features
- Build AI/ML workflows visually through out of the box blocks and by interconnecting them.
- Build custom blocks or extend existing ones through code.
- Incrementally build your workflows with instant feedback loops before deploying.
- Deploy your workflows to get a Docker container that serves your workflow as a REST API.
- Keep a trace of every workflow run of your deployed workflows.

> [!IMPORTANT]
> Breaking changes:
> - This project is still in its early development phase and as a result changes will be pushed that can break your existing workflows. 

## 🚀 Getting Started

### Prerequisite: 
1. Clone the repository
    ```bash
    git clone https://github.com/farhan0167/otto-m8.git
    cd otto-m8/
    ```
2. Make sure to have Docker or Docker Desktop Installed on your computer.
3. In order to run Ollama blocks, make sure you have the Ollama server running in the background. 

### Run the project
1. Run the following command to make `run.sh` executable
   ```bash
   chmod +x run.sh
   ```
2. **Lauching the application**
    Once the script has the right permissions, you'll then need to run the `run.sh` script. This script will build all the necessary docker containers, including that of the frontend and backend. Since the server is hosted on a docker container, in order to deploy workflow containers, you'll need to mount your docker daemon to the server container which will allow the server to launch containers. You will therefore have two ways to launch:

    1. **Without mounting** the docker daemon. This will mean that you won't be able to deploy your workflows as a docker container but you can still interact with it(build workflows and testing them). Similarly, you won't be able to launch Lambdas but you should still be able to modify or create custom blocks. To run:
        ```bash
        ./run.sh
        ```
    2. **Mounting** the docker daemon. This will mean that you will be able to deploy your workflows as docker containers and similarly be able to launch Lambdas. To run:
        ```bash
        ./run.sh --launch-containers
        ```
3. This script should launch all the containers necessary to get started with otto-m8. You can start interacting with the platform by heading to `http://localhost:3000`, once the FastAPI server started completely. You should look at something like this in your logs:
      ```
      Otto Dashboard URL: http://localhost:3000
      Otto Server URL: http://localhost:8000
      INFO:     Will watch for changes in these directories: ['/app']
      INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
      INFO:     Started reloader process [1] using StatReload
      INFO:     Started server process [13]
      INFO:     Waiting for application startup.
      INFO:     Application startup complete.
      ```
4. **Debugging common issues**:
    <details>
    <summary>Error getting credentials</summary>
    <p>This error is typically related to Docker credentials, and would look something like this:<p>

    ```
    error getting credentials - err: exit status 1, out: ``
    Building slim base image...
    [+] Building 0.2s (1/2)                                    docker:desktop-linux
    [+] Building 0.2s (2/2) FINISHED                           docker:desktop-linux
    => [internal] load build definition from slim-base.Dockerfile             0.0s
    => => transferring dockerfile: 95B                                        0.0s
    => ERROR [internal] load metadata for docker.io/library/python:3.11.4-sl  0.2st
    ------
    > [internal] load metadata for docker.io/library/python:3.11.4-slim:
    ------
    slim-base.Dockerfile:1
    --------------------
      1 | >>> FROM python:3.11.4-slim
      2 |
      3 |     RUN pip install otto-m8
    --------------------
    ERROR: failed to solve: python:3.11.4-slim: failed to resolve source metadata for docker.io/library/python:3.11.4-slim: error getting credentials - err: exit status 1, out: ``
        
    ```

    To solve this simply run `rm ~/.docker/config.json` as mention in this [post](https://stackoverflow.com/questions/71770693/error-saving-credentials-error-storing-credentials-err-exit-status-1-out).
    </details>


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
pip install -U otto-m8
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
- [x] Multimodality for OpenAI (Experimental)
- [x] SDK for interacting with deployed workflows
- [x] Observability for every block's output like a Logger
- Memory for Chatbot and RAG. Goal is to not clutter the drawing board.
  - [x] Memory
  - [ ] RAG
- [x] Streamline workflow creation, edits and redeployment. Some form of version control
- [x] Apart from Lambdas that deploy seperate docker containers for custom code, build a custom code block which is deployed within the workflow container.
- [ ] Creating other Block types: Conditionals, Aggregators, Loops. This will require change to how workflow runs and introducing handle types in the dashboard.


## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](https://github.com/farhan0167/otto-m8/blob/main/LICENSE) file for details.