#!/bin/bash

# Navigate to the lib directory
cd "$(dirname "$0")/lib" || exit

# Function to handle cleanup on keyboard interrupt
cleanup() {
    echo "Caught interrupt signal. Stopping Docker Compose services..."
    sudo docker compose down
    exit 0
}

# Trap the SIGINT signal (Ctrl+C) and run the cleanup function
trap cleanup SIGINT

# Build and run Docker Compose
echo "Building and running Docker Compose in lib directory..."
sudo docker compose up -d

# Navigate to the FastAPI directory (update this path to the correct one)
cd "./otto_backend/" || exit
mkdir .cache

LOCK_FILE="poetry.lock"

if [ -f "$LOCK_FILE" ]; then
    echo "$LOCK_FILE found. Removing..."
    rm "$LOCK_FILE"
    echo "$LOCK_FILE removed."
fi

echo "Building slim base image..."
sudo docker build -f slim-base.Dockerfile -t farhan0167/otto-m8-slim-base:latest .

echo "Building base image..."
sudo docker build -f base.Dockerfile -t farhan0167/otto-m8-base:latest .

# Echo the react app URL
echo "Otto Dashboard URL: http://localhost:3000"

# Install dependencies
echo "Installing dependencies..."
poetry install

# Start the FastAPI server using Uvicorn
echo "Starting FastAPI server..."
poetry run uvicorn client:app --host 0.0.0.0 --port 8000 --reload
