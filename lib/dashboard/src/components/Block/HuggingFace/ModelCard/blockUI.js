import React from 'react'
import { Form } from 'react-bootstrap';

const HuggingFaceBlockUI = ({data}) => {
  return (
    <>
        <Form>
            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Model Card</Form.Label>
            <Form.Control
                type="text"
                value={data.modelCard}
                disabled
            />
            </Form.Group>
        </Form>
    </>
  )
}

export default HuggingFaceBlockUI