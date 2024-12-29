FROM python:3.11.4-slim

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app

COPY . /app

RUN pip install poetry


RUN poetry install