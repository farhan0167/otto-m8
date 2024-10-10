import React from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';

const HuggingFaceModelCarSideBarData = ({sideBarData, onDataChange}) => {
  return (
    <Form.Group controlId="formResourceType">
        <Form.Label>Model Card</Form.Label>
        <Form.Control
        type="text"
        value={sideBarData.data.modelCard || ''}
        onChange={(e) => onDataChange('modelCard', e.target.value)}
        />
        <CustomAlert 
            alertText="Make sure to configure your Input Block input type properly for this model card."
            level="warning"
        />
    </Form.Group>
  )
}

export default HuggingFaceModelCarSideBarData