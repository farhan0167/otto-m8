from implementations.integrations.catalog import IntegrationCatalog
from implementations.integrations.integration import Integration

        
class IntegrationImplementer:
    def __init__(self) -> None:
        self._auto_register_tasks()
        
    def _auto_register_tasks(self):
        # Instead of directly storing the value (which is the class), store the enum instance
        self.integration_catalog = {str(integration_type).split(".")[-1]: integration_type for integration_type in IntegrationCatalog}
    
    def create_integration(self, integration_type: str, run_config: dict = None) -> Integration:
        # Retrieve the enum instance and use its initialize method to create the task
        Integration_Class: IntegrationCatalog = self.integration_catalog.get(integration_type.upper(), None)
        if Integration_Class is None:
            raise ValueError(f"Task type {integration_type} is not supported")
        # Go to the Task Catalog to initialize the task of the given type
        return Integration_Class.initialize(run_config=run_config)