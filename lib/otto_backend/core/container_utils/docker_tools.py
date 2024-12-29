import io
import json
import shutil
import tempfile
import os
import socket
import time
import docker

class DockerTools:
    
    @staticmethod
    def create_container_with_in_memory_dockerfile(payload, debug=False):
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
        begin = time.time()
        client = docker.from_env()
        json_payload = json.dumps(payload)

        source_dir = os.getcwd()
        host_cache_path = os.path.join(source_dir, ".cache")
        
        # Create the Dockerfile content
        dockerfile_content = f"""
        FROM farhan0167/otto-m8-base:latest

        # Set the working directory
        WORKDIR /app

        # Write the JSON payload directly into the container
        RUN echo '{json_payload}' > /app/data.json
        
        # Command to run the FastAPI app with Uvicorn
        CMD ["poetry", "run", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
        """
        
        dockerfile = io.BytesIO(dockerfile_content.encode('utf-8'))
        dockerfile.seek(0)

        # Build the Docker image from the temporary directory
        image, logs = client.images.build(
            fileobj=dockerfile,
            dockerfile='Dockerfile',
            path=source_dir,
            tag=payload['workflow_name'].lower(),
            rm=True,
            cache_from=["farhan0167/otto-m8-base:latest"]
        )
        if debug:
            for log in logs:
                print(log.get('stream', ''))
            
        host_port = DockerTools.find_available_port(8001, 9000)
        # Run the container
        container = DockerTools.start_docker_container(image_id=image.id, host_port=host_port, host_cache_path=host_cache_path)
        end = time.time()
        print(f"Time taken to create workflow: {end - begin}s")
        print(f"Container started with ID: {container.short_id}")
        # TODO: Make localhost configurable. Not everything will stay in localhost.
        deployment_url = f"http://localhost:{host_port}/workflow_run"
        print(f"Run workflow with: {deployment_url}")
        # TODO Make this better, such as a tuple
        return container, deployment_url, dockerfile_content, image
        
    @staticmethod
    def get_dependency_list_paths(payload):
        dependencies = []
        dependency_store_path = './implementations/tasks/dependencies'
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
    def start_docker_container(image_id:str, host_port:int=8001, host_cache_path=None):
        """
        Start a docker container given an image id. The container will be started detached and bind the port 8000 to the given host port.

        Args:
            image_id (str): The id of the docker image to use.
            host_port (int, optional): The host port to bind to. Defaults to 8001.

        Returns:
            docker.models.containers.Container: The started container.
        """
        volumes = {host_cache_path: {'bind': '/root/.cache', 'mode': 'rw'}} if host_cache_path else None
        client = docker.from_env()
        container = client.containers.run(
                image=image_id,
                ports={'8000/tcp': ("0.0.0.0", host_port)},
                detach=True,
                volumes=volumes
                # TODO add name of the container
            )
        return container
    