FROM python:3.11.4-slim

WORKDIR /app

COPY . /app

ARG MOUNT_PATH
ENV MOUNT_PATH=$MOUNT_PATH

RUN pip install poetry

#RUN poetry config virtualenvs.in-project true

RUN poetry install