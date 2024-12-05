import React from 'react'
import { Form } from 'react-bootstrap';
import { Handle, Position } from '@xyflow/react';

const OllamaChatBlockUI = ({data}) => {
  return (
    <>
        <Form>
            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Model</Form.Label>
            <Form.Control
                type="text"
                value={data.model}
                disabled
            />
            </Form.Group>
        </Form>
    </>
  )
}

export default OllamaChatBlockUI