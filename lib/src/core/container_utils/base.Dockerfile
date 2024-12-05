FROM python:3.10-slim

# Install shared dependencies
RUN pip install fastapi uvicorn \
                python-multipart pillow requests \
                langchain-community pypdf