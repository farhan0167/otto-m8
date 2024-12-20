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

### Huggingface Multimodal
![hf_multimodal_demo](/docs/assets/hf_multimodal.gif)