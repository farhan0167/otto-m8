import React from 'react'
import { Form } from 'react-bootstrap';
import { MultimodalSelector } from '../../../../features/InputParsers/Huggingface/Multimodal';

const HuggingFaceMultimodalSideBarData = ({sideBarData, onDataChange, connectedSourceNodes}) => {
  return (
    <>
      <Form.Group className='form-group' controlId="formResourceType">
          <Form.Label>Model Card</Form.Label>
          <Form.Control
          type="text"
          value={sideBarData.modelCard || ''}
          onChange={(e) => onDataChange('modelCard', e.target.value)}
          />
      </Form.Group>
      <Form.Group className='form-group' controlId="formResourceType">
          <Form.Label>HF Task Type</Form.Label>
          <Form.Control
          type="text"
          value={sideBarData.huggingface_task_type || ''}
          onChange={(e) => onDataChange('huggingface_task_type', e.target.value)}
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
      <MultimodalSelector 
        onDataChange={onDataChange}
        blockData={sideBarData}
        connectedSourceNodes={connectedSourceNodes}
      />
    </>
  )
}

export default HuggingFaceMultimodalSideBarData