import React from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';

const HuggingFaceModelCarSideBarData = ({sideBarData, onDataChange}) => {
  return (
    <>
      <Form.Group className='form-group' controlId="formResourceType">
          <Form.Label>Model Card</Form.Label>
          <Form.Control
          type="text"
          value={sideBarData.modelCard || ''}
          onChange={(e) => onDataChange('modelCard', e.target.value)}
          />
          <CustomAlert 
              alertText="Make sure to configure your Input Block input type properly for this model card."
              level="warning"
          />
      </Form.Group>
      <Form.Group className='form-group' controlId="formResourceType">
        <Form.Check // prettier-ignore
          type="switch"
          id="custom-switch"
          label="Pass Input to Output"
          className='custom-switch-size'
          checked={sideBarData.pass_input_to_output || false}
          onChange={(e) => onDataChange('pass_input_to_output', e.target.checked)}
        />
      </Form.Group>
    </>
  )
}

export default HuggingFaceModelCarSideBarData