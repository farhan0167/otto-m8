import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Run from '../../RunTemplate/Run'
import { useInputHandlerHooks, useUploadFileNameHooks} from '../../../hooks/input_handlers'
import { useLoadingStateHook } from '../../../hooks/use_loading'
import { processNodeDataForBackend } from './Utils/ProcessDataForBackend'
import { prepareInputBlock } from '../../InputHandles/utils'
import { createInputPayload } from '../../InputHandles/createInputPayload'
import { useAuth } from '../../../contexts/AuthContext'

const TestWorkflow = ({
    show,
    handleClose,
    nodes,
    edges
}) => {
    const { token, logout } = useAuth();
    const { loading, setLoading } = useLoadingStateHook();
    const [blockData, setBlockData] = useState({});
    const [backendTemplate, setBackendTemplate] = useState({});

    const {
        inputTextBlocks, setInputTextBlocks,
        inputUploadBlocks, setInputUploadBlocks,
        inputURLBlocks, setInputURLBlocks,
        inputData, setInputData
    } = useInputHandlerHooks();
    
    const {
        uploadFileNames, 
        setUploadFileName,
    } = useUploadFileNameHooks();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading({loading: true, message: 'Loading...'});
        let requestBody = {};
        requestBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            backend_template: backendTemplate,
            data: inputData
        }),
        };

        fetch("http://localhost:8000/test_workflow", requestBody)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            setBlockData(data);
            setLoading({loading: false, message: ''});
        })
        .catch((err) => {
            console.log(err);
            setLoading({loading: false, message: ''});
        });
    }

    useEffect(() => {
        if (nodes.length > 0 && edges.length > 0) {
            const backend_template = processNodeDataForBackend(nodes, edges);
            setBackendTemplate(backend_template);
            const { user_input, uploads, urls } = prepareInputBlock(backend_template['input'])
            setInputTextBlocks(user_input)
            setInputUploadBlocks(uploads)
            setInputURLBlocks(urls)

            const inputPayload = createInputPayload(backend_template['input'])
            setInputData((prev) => ({ ...prev, ...inputPayload }));
        }
    } , [nodes, edges]);
  return (
    <>
        <Modal 
        show={show} onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header closeButton>
            <Modal.Title>Test Workflow</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {loading.loading != true? (
                <Run
                    blockData={blockData}
                    showChatButton={false}
                    handleChatButtonClick={() => {}}
                    inputTextBlocks={inputTextBlocks}
                    inputUploadBlocks={inputUploadBlocks}
                    inputData={inputData}
                    setInputData={setInputData}
                    uploadFileNames={uploadFileNames}
                    setUploadFileName={setUploadFileName}
                    handleSubmit={handleSubmit}
                />
            ): <p style={{height:'100vh'}}>{loading.message}</p>}
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    </>
  )
}

export default TestWorkflow