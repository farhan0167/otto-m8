FROM python:3.11.4-slim

WORKDIR /app

COPY . /app

RUN pip install poetry

RUN poetry config virtualenvs.in-project true

RUN poetry install