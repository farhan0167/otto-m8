#!/bin/bash

# Navigate to the lib directory
cd "$(dirname "$0")/lib" || exit

# Function to handle cleanup on keyboard interrupt
cleanup() {
    echo "Caught interrupt signal. Stopping Docker Compose services..."
    docker compose down
    exit 0
}

# Trap the SIGINT signal (Ctrl+C) and run the cleanup function
trap cleanup SIGINT

# Build and run Docker Compose
echo "Building and running Docker Compose in lib directory..."
docker compose up -d

# Navigate to the FastAPI directory (update this path to the correct one)
cd "./src/" || exit

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "Virtual environment exists. Activating venv..."
    source venv/bin/activate
else
    echo "Virtual environment not found. Creating venv..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
fi

# Echo the react app URL
echo "Otto Dashboard URL: http://localhost:3000"

# Start the FastAPI server using Uvicorn
echo "Starting FastAPI server..."
uvicorn client:app --host 0.0.0.0 --port 8000 --reload
