# Otto-m8 Python SDK

A Flowchart based automation platform to run deep learning workloads with minimal to no code.

otto-m8 (automate) lets users spin up a wide range of AI models, starting from Traditional deep learning models to large language models, all through a flowchart like user interface. At its core, otto-m8 will deploy a Docker container of your workflow that you can use as an API to integrate with your existing workflows, build a AI assistant chatbot or use it as a standalone API/application.

The idea is simple-provide a easy-to-use user interface to spin up AI models. A lot of code needed to run AI models(both LLMs and traditional deep learning models) are boilerplate code blocks, including the deployments which is more often than not a REST API serving the model. The goal of otto-m8 is not only to abstract that through code but to abstract the entire process into a UI. Otto-m8 operates with a Input, Process, Output paradigm, where every flow has some form of input, that gets processed via a series of processes, and then an output.

## Getting Started

1. Make sure you have otto-m8 running in the background by following these [instructions](https://github.com/farhan0167/otto-m8?tab=readme-ov-file#getting-started).
2. Run the following:
```bash
pip install otto-m8
```
3. Interact with a deployed workflow:

```python

from otto_m8.run import OttoRun
import json

# Assuming your workflow is running on port 8001
otto = OttoRun(workflow_url='http://localhost:8001/workflow_run')

payload = otto.create_empty_payload()
# print(payload) # Do this to ensure you know the names of your input blocks

payload['Input_Block'] = "<insert your text>"

response = otto.run(payload)
print(json.dumps(response, indent=4))
```