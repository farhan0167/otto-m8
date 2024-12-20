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

export const useUploadFileNameHooks = () => {
    const [uploadFileNames, setUploadFileName] = useState([]);
    return {
        uploadFileNames,
        setUploadFileName
    }
}

export const useLoadingStateHook = () => {
    const [loading, setLoading] = useState({
        loading: false,
        message: 'Loading...'
    });
    return {
        loading,
        setLoading
    }
}