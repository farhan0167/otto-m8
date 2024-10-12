import React from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';

const OllamaServerGenerateSideBarData = ({sideBarData, onDataChange}) => {
  return (
    <div>
        <Form.Group controlId="formResourceType">
            <Form.Label>Ollama Server Endpoint</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.endpoint || ''}
            onChange={(e) => onDataChange('endpoint', e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formResourceType">
            <Form.Label>Model</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.model || 'llama3'}
            onChange={(e) => onDataChange('model', e.target.value)}
            />
            <CustomAlert 
                alertText="Make sure to configure your Input Block input type properly for this model."
                level="warning"
            />
        </Form.Group>
        <Form.Group controlId="formResourceType">
            <Form.Label>System Prompt</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            value={sideBarData.system || ''}
            onChange={(e) => onDataChange('system', e.target.value)}
            />
        </Form.Group>
    </div>
  )
}

export default OllamaServerGenerateSideBarData