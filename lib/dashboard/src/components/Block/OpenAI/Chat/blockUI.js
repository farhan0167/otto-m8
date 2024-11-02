import React from 'react'
import { Form } from 'react-bootstrap';
import { Handle, Position } from '@xyflow/react';

const OpenAIBlockUI = ({data}) => {
  return (
    <>
        <Handle type="target" position={Position.Top} id="b" />
        <span 
              style={{ 
                position: 'absolute', 
                right: '46%', 
                top: '-10px', 
                transform: 'translateY(-50%)',
                fontSize: '5px' 
              }}
            >
              tools
        </span>
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

export default OpenAIBlockUI