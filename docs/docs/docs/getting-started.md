---
title: Getting Started
description: Documentation on how to get started with otto-m8.
keywords: [python, node, docker, ollama]
sidebar_position: 2
---

## First Steps

| System Requirements | - |
| ---------- | ------- |
| RAM       | 8GB     |
| Python       | > v3.10     |
| Node.js       | > v23.3.0     |

### Docker
Otto-m8 relies on Docker to deploy workflows, since every workflow created is a
docker image. Make sure you have Docker installed on your system. It helps to
have Docker Desktop installed. That way you'll minimize time spent on writing shell
commands.
- Docker Install: https://docs.docker.com/engine/install/
- Docker Desktop: https://docs.docker.com/desktop/

## Launch Otto-m8
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

### Ollama
If you plan to run Ollama, make sure to have Ollama installed locally.
- Download: https://ollama.com/download
- For any model you use, make sure to run the following:
```bash
ollama run <model-name>
```
To get a list of all the supported models, click [here](https://github.com/ollama/ollama?tab=readme-ov-file#model-library).