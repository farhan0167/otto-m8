import React, { useState } from 'react'
import { Button, Form, Alert, ListGroup } from 'react-bootstrap'

/**
 * Component(Button) to handle file upload input for workflow blocks
 * 
 * @function UploadFile
 * @param {object} block - Block object containing name, input_type, files_to_accept, and process_metadata
 * @param {object} inputData - Input data object
 * @param {function} setInputData - Function to set input data
 * @param {function} setUploadFileName - Function to set the name of the uploaded file
 * @returns A component that displays an upload button and handles file upload
 */
export const UploadFile = ({block, inputData, setInputData, setUploadFileName}) => {
    const name = block.name;
    const [error, setError] = useState(null);

  const handleUploadClick = () => {
    // Create an input element to trigger file selection
    const input = document.createElement('input');
    input.type = block.input_type;
    input.accept = block.files_to_accept; // You can adjust this to your needs
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploadFileName([file.name])
        convertToBase64(file);
      }
    };
    input.click(); // Simulate click to open file dialog
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1];

      setInputData({
        ...inputData,
        [name]: base64File
      })
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };

    reader.readAsDataURL(file); // Read the file as base64
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
       onClick={handleUploadClick}>
        {block.process_metadata.button_text}
      </Button>
    </>
  )
}

/**
 * Displays a list of uploaded file names.
 * 
 * @param {{uploadFileNames: string[]}} props Component props.
 * @prop {string[]} uploadFileNames An array of uploaded file names.
 * @returns {JSX.Element} A JSX element that displays a list of uploaded file names.
 */
export const UploadFileNames = ({uploadFileNames}) => {
  return (
    <>
      {uploadFileNames.length > 0 && <ListGroup style={{marginTop: '10px', marginBottom: '10px'}}>
          {uploadFileNames.map((file) => (
              <ListGroup.Item key={file}>{file}</ListGroup.Item>
          ))}
      </ListGroup>}
    </>
  )
}