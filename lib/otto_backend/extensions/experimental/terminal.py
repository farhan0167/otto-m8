import docker


class Terminal:
    """ 
    A light weight terminal class to run commands inside the main server container.
    For now this is an experimental feature.
    """
    def __init__(self):
        self.client = docker.from_env()
        self.container_name = "otto-server"
        self.current_directory = "/app"
        self.restricted_commands = [
            "exit",
            "echo",
            "nano",
        ]
        
    def run_command(self, command):
        command_start = command.split(" ")[0]
        if command_start in self.restricted_commands:
            return "This command is not allowed. Use the terminal to run other commands."
        
        if command.startswith("cd "):
            command = command + " && pwd"
            
        container = self.client.containers.get(self.container_name)
        # Run the command inside the container
        exec_result = container.exec_run(
            f"bash -c '{command}'", 
            stdout=True, 
            stderr=True, 
            workdir=self.current_directory
        )
        exec_result = exec_result.output.decode("utf-8")
        if command.startswith("cd "):
            self.current_directory = exec_result.strip()
            exec_result = ""
        return exec_result