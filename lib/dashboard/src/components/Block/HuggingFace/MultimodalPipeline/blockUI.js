import React from 'react'
import { Form } from 'react-bootstrap';

const HuggingFaceMultimodalBlockUI = ({data}) => {
  return (
    <>
        <Form>
            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Multimodal Pipeline - Model Card</Form.Label>
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

export default HuggingFaceMultimodalBlockUI