from abc import ABC, abstractmethod

class Integration(ABC):
    
    @abstractmethod
    def run(self, input_= None):
        pass