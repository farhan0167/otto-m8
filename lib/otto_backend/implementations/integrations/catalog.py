from enum import Enum
from ..base import BlockRegistry

class IntegrationCatalog(Enum):
    HTTP_POST_REQUEST = 'implementations.integrations.http.post_requests.post_request.HTTPPostRequest'
    LAMBDA_FUNCTION = 'implementations.integrations.lambda_function.lambda_function.LambdaFunction'
    
    
    def get_class(self):
        """
        Return the class instance associated with this Enum value.

        Given a full path to a class, this method will return the class instance.
        This is done by using the `__import__` method to import the module and
        then using the `getattr` method to get the class from the module.

        Args:
            None

        Returns:
            The class instance associated with this Enum value.
        """
        module_name, class_name = self.value.rsplit('.', 1)
        module = __import__(module_name, fromlist=[class_name])
        return getattr(module, class_name)
    
    def initialize(self, run_config: dict = None, *args, **kwargs):
        """
        Initialize a task with the given run configuration.

        This method is the preferred way to initialize a task. It takes care of
        getting the class instance associated with this Enum value and passing
        the run configuration to the class's constructor.

        Args:
            run_config (dict, optional): The run configuration for the task.

        Returns:
            An instance of the class associated with this Enum value.
        """
        # Get the class and initialize it
        cls = self.get_class()
        # if run_config was passed, init the class with the run_config else use the default
        return cls(run_config, *args, **kwargs) if run_config is not None else cls(*args, **kwargs)
    
class IntegrationRegistry(BlockRegistry):
    process_type = "integration"
    
# Register Integrations and Vendors
IntegrationRegistry.add_vendor("HTTP")
IntegrationRegistry.add_block_to_registry_by_vendor(
    vendor="HTTP",
    task=IntegrationCatalog.HTTP_POST_REQUEST, 
    ui_block_type="process",
    source_path="implementations/integrations/http/post_requests/post_request.py"
)

IntegrationRegistry.add_vendor("Custom Code")
IntegrationRegistry.add_block_to_registry_by_vendor(
    vendor="Custom Code",
    task=IntegrationCatalog.LAMBDA_FUNCTION, 
    ui_block_type="process",
    source_path="implementations/integrations/lambda_function/lambda_function.py"
)