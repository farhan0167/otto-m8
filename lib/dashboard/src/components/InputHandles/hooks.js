import { useState } from "react";

export const useInputHandlerHooks = () => {
    const [inputTextBlocks, setInputTextBlocks] = useState([]);
    const [inputUploadBlocks, setInputUploadBlocks] = useState([]);
    const [inputURLBlocks, setInputURLBlocks] = useState([]);
    const [inputData, setInputData] = useState({});

    return {
        inputTextBlocks,
        setInputTextBlocks,
        inputUploadBlocks,
        setInputUploadBlocks,
        inputURLBlocks,
        setInputURLBlocks,
        inputData,
        setInputData
    }
}