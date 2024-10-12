from abc import ABC, abstractmethod

class Integration(ABC):
    
    @abstractmethod
    def run(self):
        pass