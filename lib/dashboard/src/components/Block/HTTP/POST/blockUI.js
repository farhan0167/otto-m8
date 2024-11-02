import React from 'react'
import { Form } from 'react-bootstrap';

const HTTPPostBlockUI = ({data}) => {
  return (
    <>
        <Form>
            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Method</Form.Label>
            <Form.Control
                type="text"
                value={data.method}
                disabled
            />
            </Form.Group>

            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Endpoint</Form.Label>
            <Form.Control
                type="text"
                value={data.endpoint}
                disabled
            />
            </Form.Group>
        </Form>
    </>
  )
}

export default HTTPPostBlockUI