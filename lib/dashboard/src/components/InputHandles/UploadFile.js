import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

const UploadFile = ({block, inputData, setInputData}) => {
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
        Upload PDF
      </Button>
    </>
  )
}

export default UploadFile