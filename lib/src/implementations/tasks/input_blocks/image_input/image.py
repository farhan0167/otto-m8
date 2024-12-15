from typing import Union
from core.data_loaders.image import ImageLoader
from core.types import InputType
from implementations.base import BaseImplementation

class ImageInput(BaseImplementation):
    def __init__(self, run_config:dict) -> None:
        self.input_type = run_config.get('input_type')
    
    def run(self, input_: Union[str, bytes] = None):
        image = None
        if self.input_type == InputType.URL.value:
            image = ImageLoader.load_image_from_url(input_)
        elif self.input_type == InputType.FILE.value:
            image = ImageLoader.load_image_from_bytes(input_)
        else:
            raise ValueError(f"Unsupported input type: {type(input_)}")
        
        return image