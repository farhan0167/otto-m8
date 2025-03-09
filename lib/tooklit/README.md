# Otto-m8 Python SDK

A Flowchart based automation platform to run deep learning workloads with minimal to no code.

otto-m8 (automate) is a low code platform that allows users to build AI/ML workflows through a flowchart like UI. In other words, you can visually declare how you build AI workflows or agents. Its low code because you are still in control over the implementation of a block(yes you can not only add custom blocks but also modify out of the box blocks), and more importantly, its a platform that isn't specifically built on top of an existing AI framework like Langchain. What this means is that, you can build you workflows with any framework you see fit, whether it is Langchain, Llama Index or the AI providers sdk themselves.

At its core, otto-m8 views the problem of building any AI workflow as a graph problem. As developers, we mostly build modular components where each components are responsible for a specific task (consider them as nodes), and each component sends data between each other (the edges). Together you get a workflow which consists of inputs, some transformations of the inputs(we'll call them processes), and an output.

## Getting Started

1. Make sure you have otto-m8 running in the background by following these [instructions](https://github.com/farhan0167/otto-m8?tab=readme-ov-file#getting-started).
2. Run the following:
    ```bash
    pip install otto-m8
    ```
3. Figure out the payload to be used:
    ```python
    from otto_m8.run import OttoRun
    import json

    # Assuming your workflow is running on port 8001
    otto = OttoRun(workflow_url='http://localhost:8001/workflow_run')

    payload = otto.create_empty_payload()
    print(payload)
    # Output: {"Input_Block": None}
    ```
4. Interact with a deployed workflow:

    ```python

    from otto_m8.run import OttoRun
    import json

    # Assuming your workflow is running on port 8001
    otto = OttoRun(workflow_url='http://localhost:8001/workflow_run')

    payload['Input_Block'] = "<insert your text>"

    response = otto.run(payload)
    print(json.dumps(response, indent=4))
    ```

### Instantiate with Workflow name

In the event you do not have a deployed workflow, and it is in draft stage, you can configure `OttoRun` with the workflow name.

```python
from otto_m8.run import OttoRun

otto = OttoRun(
    workflow_name="<name-of-your-draft-workflow>"
)
```