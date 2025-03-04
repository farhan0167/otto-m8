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
With Docker running in the background, you can do the following:
1. Clone the Github repository:
```bash
git clone https://github.com/farhan0167/otto-m8.git
```
2. Launch the application
```bash
cd otto-m8
chmod +x run.sh
./run.sh
```
The command will launch all the necessary containers and the main server needed to get
everything working. To go to the dashboard, go to `http://localhost:3000`

### Ollama
If you plan to run Ollama, make sure to have Ollama installed locally.
- Download: https://ollama.com/download
- For any model you use, make sure to run the following:
```bash
ollama run <model-name>
```
To get a list of all the supported models, click [here](https://github.com/ollama/ollama?tab=readme-ov-file#model-library).