from abc import ABC, abstractmethod

class Task(ABC):
    
    @abstractmethod
    def run(self):
        pass