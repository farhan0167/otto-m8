import React, { useState } from 'react';
import { Button, Form, Alert, ListGroup } from 'react-bootstrap';
import { CgAttachment } from 'react-icons/cg';


export const UploadFile = ({ block, inputData, setInputData, setUploadFileName }) => {
    const name = block.name;
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);

    const handleUploadClick = () => {
        const input = document.createElement('input');
        input.type = block.input_type;
        input.accept = block.files_to_accept;
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setUploadFileName([file.name]);
                setUploadedFileName(file.name);
                convertToBase64(file);
                generatePreview(file);
            }
        };
        input.click();
    };

    const convertToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64File = reader.result.split(',')[1];
            setInputData({ ...inputData, [name]: base64File });
        };
        reader.onerror = () => setError('Failed to read the file');
        reader.readAsDataURL(file);
    };

    const generatePreview = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (file.type.startsWith('image/')) {
                setPreview(<img src={reader.result} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />);
            } else if (file.type.startsWith('text/')) {
                setPreview(<pre style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto', marginTop: '10px' }}>{reader.result}</pre>);
            } else if (file.type === 'application/pdf') {
                setPreview(<iframe src={reader.result} style={{ width: '100%', height: '300px', marginTop: '10px' }} title="PDF Preview"></iframe>);
            } else {
                setPreview(<p style={{ marginTop: '10px' }}>Preview not available</p>);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button 
                style={{
                    backgroundColor: 'transparent',
                    border: '1px solid black',
                    color: 'black',
                    borderRadius: '15px',
                    width: '30%',
                }}
                onClick={handleUploadClick}
            >
                {block.process_metadata.button_text}
            </Button>
            {preview && <div>{preview}</div>}
        </>
    );
};

export const UploadFileNames = ({ uploadFileNames }) => {
    return (
        <>
            {uploadFileNames.length > 0 && (
                <ListGroup style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {uploadFileNames.map((file) => (
                        <ListGroup.Item style={{ fontSize: '14px', backgroundColor: '#f2f0ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={file}>
                            <div>
                                <CgAttachment />
                                <span style={{ marginLeft: '5px' }}>{file}</span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </>
    );
};
