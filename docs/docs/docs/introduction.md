---
description: Introduction to Otto-m8 documentation.
keywords: [chatbot, ai, openai, gpt4o-mini, gpt4, nocode, workflows, documentation]
sidebar_position: 1
---

# Introduction

**Otto-m8** (automate) is a low code platform that allows users to build AI/ML workflows through a flowchart like UI. In other words, you can visually declare how you build AI workflows or agents. Its low code because you are still in control over the implementation of a block(yes you can not only add custom blocks but also modify out of the box blocks), and more importantly, its a platform that isn't specifically built on top of an existing AI framework like Langchain. What this means is that, you can build you workflows with any framework you see fit, whether it is Langchain, Llama Index or the AI providers sdk themselves.

At its core, otto-m8 views the problem of building any AI workflow as a graph problem. As developers, we mostly build modular components where each components are responsible for a specific task (consider them as nodes), and each component sends data between each other (the edges). Together you get a workflow which consists of inputs, some transformations of the inputs(we'll call them processes), and an output.

## Key Features
- Build AI/ML workflows visually through out of the box blocks and by interconnecting them.
- Build custom blocks or extend existing ones through code.
- Incrementally build your workflows with instant feedback loops before deploying.
- Deploy your workflows to get a Docker container that serves your workflow as a REST API.
- Keep a trace of every workflow run of your deployed workflows.

## Project Roadmap
- [x]  Basic Chatbot and HF workflows
- [x]  Function Calling
- [x]  Lambda Functions/ Custom Code blocks
- [x]  Multimodality for Huggingface
- [x]  Multimodality for OpenAI (Experimental Phase)
- [x]  SDK for interacting with deployed workflows
- [x]  Observability for every block's output like a Logger or Tracer
- [ ]  Memory for Chatbot and RAG. Goal is to not clutter the drawing board.
- [x]  Streamline workflow creation, edits and redeployment.
- [x]   Apart from Lambdas that deploy seperate docker containers for custom code, build a custom code block which is deployed within the workflow container.
- [ ] Creating other Block types: Conditionals, Aggregators, Loops. This will require change to how workflow runs and introducing handle types in the dashboard.
- [ ]  **Got ideas for other integrations you think will be useful? Create a Github [Issue](https://github.com/farhan0167/otto-m8/issues)**