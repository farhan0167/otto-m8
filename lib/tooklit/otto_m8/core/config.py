

class OttoConfig:
    def __init__(
        self,
        base_url: str = "http://localhost:8000",
        database_host: str = "localhost"
    ):
        self.base_url = base_url
        self.database_host = database_host