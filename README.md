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
![hf_multimodal_demo](https://farhan0167-otto-m8.s3.us-east-1.amazonaws.com/hf_multimodal.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA26EOLBHRSW5G3BCR%2F20241220%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241220T040442Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJFMEMCICg%2FTmIvtoQ9J3HkhQrLzXitLegg%2Bq5eLm1ZQC604ZY7Ah8bxBnHcevzKlnNOh%2F1C6d2U8mQo9VMOlaIH%2BrAfZObKogDCIX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQAhoMNzUxOTE3Nzk1ODExIgzhoUC8k7uSdFgJmLYq3AKsLe1Ka2kqgY3m%2BbQpD4HJ00l9IgDsCICko6By0XghIwTriqqTmeFabaH6saZzx8viMDdk%2FT9z8DIbntpEmJDvOV0jQIsvF0fWQIaCzvd%2Bu8AnTh0qP32Jgi28pR8Q4S39PUP2mWv2YSRjRMl%2FDERo6jxUCYqb0iKLauaNdvWelYy%2BgCo8aCppVS9LvWTXcwxPDhBE%2F5%2BprBlu92ZRAkGRiYczFoASJpGenoDsI9mrlmmP3yGsHOCh4H3Cn9Z1B%2B0q0mxSvPB1BeJp57FTfKpIU7HMl9RxeLWDjJJHVbZby4Bk2KsptkHCJIAbArG6wqIhogA6f59XHC0TRmChas8hZyCNRkypF0O%2FMBynOyoVYeHowLe26ZzDOyCwEVfWwRRDnn7%2BQnuqlCsg8NkxdcEcKO12gyj23imZykLFB3PqyjollFNyGTAhLDt2vGXpLQJno3Gvaj2vVqKuXNYw7saTuwY6tQLX6Ymvy7Qnsk5UAgDXOZWg6rFVMjtxtAOWCEXUMs9%2B98aaA2B6JKXWmhGrkyF%2F3i8pndC64GimEk%2BTD4z18Joety79%2B8aYe%2FajGrrtzoZay5LWn6%2FPBQV%2BayU9jTbfdF1%2BUT9id2O2lFhloZmz70z7MUa3%2BotNABFgVeQ1l8pkkM38ThzBY6ZaVwQogUj8o%2BGdz8s8ozqRFagEGqLZ8G8c%2BXRtYVL8WK%2Fy9bi4DgrZHdX085eufWQ2ILISeKd7Y471jR3qv3lwdQwBT6tJ8Gt0oP8m8YwmP08ijBv3IVLwKWg1CLLeW6mFPYDWM4pIK5MDigd5o1ckHO1Vp9dW5HAdQBI%2BgBZtu6CViImUEhke9BJbd2%2Fp355SI65e6Xbbr3uoHHlHEsuamhwTF%2Brh4q6GUvFVLtI%3D&X-Amz-Signature=f5acf9aa54eb0080f7fd4b5471d0138557b61ea52ac725826855d7f219160543&X-Amz-SignedHeaders=host&response-content-disposition=inline)