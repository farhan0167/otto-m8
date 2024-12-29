from huggingface_hub import HfApi
api = HfApi()

class HuggingFaceApi:
    """Wrapper utility class for Hugging Face API"""
    
    @staticmethod
    def search_model(model_name:str):
        """
        Search for a model by name on the Hugging Face Hub.

        Parameters
        ----------
        model_name : str
            The name of the model to search for. One can search for a model by name, tag or author.
            

        Returns
        -------
        models : list[ModelInfo]
            A list of :class:`ModelInfo` objects containing information about the models found.
        """
        
        return api.list_models(search=model_name)

if __name__ == "__main__":
    def get_huggingface_pipeline_config(model_card):
            models = HuggingFaceApi.search_model(model_card)
            for model in models:
                print(">>",model.modelId)
                if model.modelId == model_card:
                    print(f"pipeline: {model.pipeline_tag}")
                    print(model.__dict__)
                    return
                else:
                    raise Exception(f"Model card {model_card} not found")
    get_huggingface_pipeline_config("loony-huggingface/english-to-spanish-lang-translation-model")
