#!/bin/bash

# Navigate to the lib directory
cd "$(dirname "$0")/lib" || exit

# Default: Use standard docker-compose
COMPOSE_FILE="docker-compose.yml"
CAN_DEPLOY_WORKFLOW=false

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --launch-containers) 
            COMPOSE_FILE="docker-compose.privilleged.yml"
            CAN_DEPLOY_WORKFLOW=true
            ;;
        *) 
            echo "Unknown parameter: $1"; 
            exit 1 
            ;;
    esac
    shift
done

# Function to handle cleanup on keyboard interrupt
cleanup() {
    echo "Caught interrupt signal. Stopping Docker Compose services..."
    docker compose down
    exit 0
}

# Trap the SIGINT signal (Ctrl+C) and run the cleanup function
trap cleanup SIGINT

# Navigate to the FastAPI directory (update this path to the correct one)
cd "./otto_backend/" || exit
mkdir .cache


echo "Building slim base image..."
docker build -f slim-base.Dockerfile -t farhan0167/otto-m8-slim-base:latest .

echo "Building base image..."
docker build -f base.Dockerfile -t farhan0167/otto-m8-base:latest --build-arg MOUNT_PATH=$(pwd) .

docker build -f server.Dockerfile -t farhan0167/otto-m8-server:latest .

cd "../dashboard"

echo "Building dashboard image..."
docker build -f Dockerfile -t farhan0167/otto-m8-dashboard:latest --build-arg CAN_DEPLOY_WORKFLOW=$CAN_DEPLOY_WORKFLOW .

cd ".."

# Use the selected Compose file to build and start the services
echo "Building and running Docker Compose with $COMPOSE_FILE and CAN_DEPLOY_WORKFLOW=$CAN_DEPLOY_WORKFLOW..."
docker compose -f "$COMPOSE_FILE" up -d


# Echo the react app URL
echo "Otto Dashboard URL: http://localhost:3000"
echo "Otto Server URL: http://localhost:8000"

docker logs -f otto-server
