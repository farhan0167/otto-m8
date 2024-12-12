from enum import Enum

class InputType(Enum):
    """Types of input for a block"""
    TEXT = 'text'
    FILE = 'file'
    URL = 'url'