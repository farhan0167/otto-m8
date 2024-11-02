import React from 'react'
import { Form } from 'react-bootstrap';

const LambdaBlockUI = ({data}) => {
  return (
    <>
        <Form>
            <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Function</Form.Label>
            <Form.Control
                type="text"
                value={data.lambda_function_name}
                disabled
            />
            </Form.Group>
        </Form>
    </>
  )
}

export default LambdaBlockUI