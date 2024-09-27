import { initialDataHuggingFaceModelCard } from "./HuggingFace/ModelCard/initialData";

export const initialDataProcessBlock = ({nodeType, processBlockType}) => {
    if (processBlockType === 'hugging_face_model_card') {
        return initialDataHuggingFaceModelCard(nodeType)
    }
}