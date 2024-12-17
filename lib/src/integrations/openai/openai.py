from openai import OpenAI

class OpenAIClient:
    def __init__(self, key) -> None:
        self.client = OpenAI(api_key=key)