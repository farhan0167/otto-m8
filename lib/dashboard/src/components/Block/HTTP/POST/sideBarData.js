import React, { useState } from 'react'
import { Form, Alert } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';
import { json } from 'react-router-dom';

const HTTPPostSideBarData = ({sideBarData, onDataChange, screen}) => {

    const [data, setData] = useState(sideBarData.data || {});

    const handleOnChange = (field, value) => {
        setData((prevData) => ({ ...prevData, [field]: value }))
        if (screen === 'workflow'){
            onDataChange(field, value)
        }
        else {
            console.log("other side bar data")
        }
    }

    const handleOnBlur = () => {
        if (screen === 'workflow'){
            console.log("wprkflow side bar data", data)
        }
        else {
            console.log("other side bar data",data)
        }
    }

  return (
    <div>
        <Form.Group controlId="formResourceType">
            <Form.Label>Endpoint</Form.Label>
            <Form.Control
            type="text"
            value={data.endpoint || ''}
            onChange={(e) => handleOnChange('endpoint', e.target.value)}
            onBlur={handleOnBlur}
            />
        </Form.Group>
    </div>
  )
}

export default HTTPPostSideBarData

{/**
const [jsonBody, setJsonBody] = useState(sideBarData.data.body || '');
const [error, setError] = useState(null);

const handleBlur = () => {
    try {
        JSON.parse(jsonBody); // Validate JSON on blur
        setError(null); // Clear error if valid
        onDataChange('body', jsonBody); // Update if valid
    } catch (e) {
        setError('Invalid JSON format'); // Set error if invalid
    }
    };
    
const handleInputChange = (value) => {
    setJsonBody(value); // Just update the local state while typing
};
<Form.Group controlId="formResourceType">
            <Form.Label>Body</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            value={jsonBody}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleBlur} // Validate on blur
            isInvalid={!!error} // Show invalid style if there's an error
            />
            {error && <Alert variant="danger">{error}</Alert>}
</Form.Group>
*/}