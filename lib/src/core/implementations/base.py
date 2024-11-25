from abc import abstractmethod, ABC

class BaseImplementation(ABC):
    """Base class for all implementations. An implementation is a class that implements a
    library(third party integrations) for a Block."""
    
    @abstractmethod
    def run(self):
        pass