import React from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

const TextInput = ({block, inputData, setInputData}) => {
    const name = block.name;
    const handleChange = (e) => {
        setInputData({
            ...inputData,
            [name]: e.target.value
        })
    }
  return (
   <>
        <Form.Group className='form-group' controlId="textInput">
            <Form.Label>Type your text here:</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                value={inputData[name] || ''}
                onChange={handleChange}
                placeholder="Enter text..."
                required
            />
        </Form.Group>
   </>
  )
}

export default TextInput