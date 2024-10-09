import React, { useState } from 'react'
import { Form, Alert } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';
import { json } from 'react-router-dom';

const HTTPPostSideBarData = (sideBarData, onDataChange) => {

  return (
    <div>
        <Form.Group controlId="formResourceType">
            <Form.Label>Endpoint</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.data.endpoint || ''}
            onChange={(e) => onDataChange('endpoint', e.target.value)}
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