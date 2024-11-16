import io
import json
import shutil
import tempfile
import os
import socket

import docker

class DockerTools:
    
    @staticmethod
    def create_container_with_in_memory_dockerfile(payload):
        """
        Create a Docker container from the given payload by writing the payload
        as a JSON file directly into the container. The container will be started
        detached and will bind the port 8000 to a free port on the host. This is
        one of the core workings of the project, wherein for any given payload, we
        can spin up Docker containers.

        Args:
            payload (dict): The payload to write as a JSON file.

        Returns:
            tuple: A tuple containing the started container, the deployment URL,
            the Dockerfile content and the built image.
        """
        client = docker.from_env()
        json_payload = json.dumps(payload, indent=4)
        escaped_json_payload = json_payload.replace('"', '\\"').replace('\n', '\\n')

        # Create a temporary directory so that we can pass our app files to docker build context
        with tempfile.TemporaryDirectory() as temp_dir:
            # Copy the files from your working directory to the temporary directory for docker build context
            source_dir = os.getcwd()
            shutil.copytree(source_dir, os.path.join(temp_dir, 'app_files'), dirs_exist_ok=True)
            
            requirement_text_files = DockerTools.get_dependency_list_paths(payload)
            requirement_text_files_for_dockerfile = [path.replace(".", "/app", 1) for path in requirement_text_files]
            if requirement_text_files:
                requirement_text_files_for_dockerfile = [path.replace(".", "/app", 1) for path in requirement_text_files]
                requirement_text_file_paths = " ".join([f"-r {path}" for path in requirement_text_files_for_dockerfile])
            else:
                requirement_text_file_paths = "fastapi"

            # Create the Dockerfile content
            dockerfile_content = f"""
            FROM farhan0167/otto-m8-base:latest

            # Set the working directory
            WORKDIR /app

            # Copy existing FastAPI app code into the container
            COPY app_files /app

            # Install task based dependencies dynamically
            RUN pip install {requirement_text_file_paths}

            # Write the JSON payload directly into the container
            RUN echo '{escaped_json_payload}' > /app/data.json

            # Command to run the FastAPI app with Uvicorn
            CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
            """
            
            # Write the Dockerfile to the temporary directory
            dockerfile_path = os.path.join(temp_dir, 'Dockerfile')
            with open(dockerfile_path, 'w') as dockerfile:
                dockerfile.write(dockerfile_content)

            # Build the Docker image from the temporary directory
            image, _ = client.images.build(
                path=temp_dir,
                # TODO add a field to the blocks for Workflow such that we can get name of the image based on payload
                tag=payload['workflow_name'].lower(),
                rm=True
            )
            host_port = DockerTools.find_available_port(8001, 9000)
            # Run the container
            container = DockerTools.start_docker_container(image_id=image.id, host_port=host_port)

            print(f"Container started with ID: {container.short_id}")
            # TODO: Make localhost configurable. Not everything will stay in localhost.
            deployment_url = f"http://localhost:{host_port}/workflow_run"
            print(f"Run workflow with: {deployment_url}")
            # TODO Make this better, such as a tuple
            return container, deployment_url, dockerfile_content, image
        
    @staticmethod
    def get_dependency_list_paths(payload):
        dependencies = []
        dependency_store_path = './tasks/dependencies'
        requirement_txt_files = os.listdir(dependency_store_path)
        requirement_txt_files = [f.replace('.txt', '') for f in requirement_txt_files]

        processes = payload['process']
        for process in processes:
            task_type = process['process_metadata']['core_block_type']
            if task_type in requirement_txt_files:
                dependencies.append(f'{dependency_store_path}/{task_type}.txt')
        return dependencies
    
    @staticmethod
    def find_available_port(start_port:int=8001, end_port:int=9000):
        """ 
        Given a range of ports, find the first available one. This function
        is used to find an available port for the container to bind to.
        """
        for port in range(start_port, end_port + 1):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                result = s.connect_ex(('localhost', port))
                if result != 0:
                    return port
        raise RuntimeError("No available ports in the specified range")
    
    @staticmethod
    def stop_docker_container(container_id: str):
        """Stop a docker container given a container id"""
        client = docker.from_env()
        try:
            container = client.containers.get(container_id)
            container.stop()
        except docker.errors.NullResource:
            print("Container not found. Nothing to stop.")
            
    @staticmethod
    def delete_docker_container(
        container_id: str
    ):
        """Delete a docker container given a container id
        including the associated image."""
        client = docker.from_env()
        if container_id:
            container = client.containers.get(container_id)
            container.remove()        
    
    @staticmethod
    def delete_docker_image(image_id: str):
        """Delete a docker image given an image id."""
        client = docker.from_env()
        try:
            client.images.remove(image=image_id)
            print(f"Image {image_id} removed successfully.")
        except docker.errors.ImageNotFound:
            print("Image not found. Nothing to remove.")
        except docker.errors.APIError as e:
            print(f"Failed to remove image: {e}")
    
    @staticmethod
    def start_docker_container(image_id:str, host_port:int=8001):
        """
        Start a docker container given an image id. The container will be started detached and bind the port 8000 to the given host port.

        Args:
            image_id (str): The id of the docker image to use.
            host_port (int, optional): The host port to bind to. Defaults to 8001.

        Returns:
            docker.models.containers.Container: The started container.
        """
        client = docker.from_env()
        container = client.containers.run(
                image=image_id,
                ports={'8000/tcp': ("0.0.0.0", host_port)},
                detach=True,
                # TODO add name of the container
            )
        return container
    