from enum import Enum

class IntegrationCatalog(Enum):
    HTTP_POST_REQUEST = 'integrations.http.post_requests.post_request.HTTPPostRequest'
    LAMBDA_FUNCTION = 'integrations.lambda_function.lambda_function.LambdaFunction'
    
    
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
    
class IntegrationRegistry:
    vendors = {}

    @classmethod
    def add_vendor(cls, vendor: str):
        if vendor not in cls.vendors:
            cls.vendors[vendor] = {}

    @classmethod
    def add_integration_to_registry_by_vendor(cls, vendor: str, integration_name: str, integrations: IntegrationCatalog):
        if vendor not in cls.vendors:
            raise Exception(f"Vendor {vendor} is not supported.")
        cls.vendors[vendor][integration_name] = integrations.name.lower()

    @classmethod
    def get_integration_registry(cls):
        return cls.vendors
    
# Register Integrations and Vendors
IntegrationRegistry.add_vendor("HTTP")
IntegrationRegistry.add_integration_to_registry_by_vendor("HTTP", "POST Request", IntegrationCatalog.HTTP_POST_REQUEST)

IntegrationRegistry.add_vendor("Custom Code")
IntegrationRegistry.add_integration_to_registry_by_vendor("Custom Code", "Lambda Function", IntegrationCatalog.LAMBDA_FUNCTION)