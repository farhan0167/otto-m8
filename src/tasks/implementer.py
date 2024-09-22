from tasks.catalog import TaskCatalog
from tasks.task import Task

# class Implementer:
#     def __init__(self) -> None:
#         self._auto_register_tasks()
        
#     def _auto_register_tasks(self):
#         self.task_catalog = {str(task_type).split(".")[-1]: task_type.value for task_type in TaskCatalog}
    
#     def create_task(self, task_type:TaskCatalog) -> Task:
#         task = self.task_catalog.get(task_type, None)
#         if task is None:
#             raise ValueError(f"Task type {task_type} is not supported")
#         return task()
        
class Implementer:
    def __init__(self) -> None:
        self._auto_register_tasks()
        
    def _auto_register_tasks(self):
        # Instead of directly storing the value (which is the class), store the enum instance
        self.task_catalog = {str(task_type).split(".")[-1]: task_type for task_type in TaskCatalog}
    
    def create_task(self, task_type: TaskCatalog, run_config: dict = None) -> Task:
        # Retrieve the enum instance and use its initialize method to create the task
        Task_Class: TaskCatalog = self.task_catalog.get(task_type, None)
        if Task_Class is None:
            raise ValueError(f"Task type {task_type} is not supported")
        # Go to the Task Catalog to initialize the task of the given type
        return Task_Class.initialize(run_config=run_config)