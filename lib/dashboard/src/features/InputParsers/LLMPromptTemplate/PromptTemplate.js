import React, { useEffect, useState } from 'react'
import { Form, Button, Dropdown } from 'react-bootstrap';

export const PromptTemplate = ({blockData, connectedSourceNodes, onDataChange}) => {
    const [inputVariables, setInputVariables] = useState([]);
    const [promptTemplate, setPromptTemplate] = useState('');

    useEffect(() => {
        setPromptTemplate(blockData.prompt);
    }, [blockData]);

    useEffect(() => {
        if (connectedSourceNodes && connectedSourceNodes.length > 0) {
            const inputVariables = connectedSourceNodes.map((node) => {
                return `${node.data.custom_name}`;
            });
            setInputVariables(inputVariables);
        }
    }, [connectedSourceNodes]);

    const onChangePromptTemplate = (e) => {
        setPromptTemplate(e.target.value);
        onDataChange('prompt', e.target.value);
    }

    const onInsertVariable = (variable) => {
        const updatedPromptTemplate = promptTemplate + `{${variable}}`;
        setPromptTemplate(updatedPromptTemplate);
        onDataChange('prompt', updatedPromptTemplate);
    }

  return (
   <>
    <Form.Group className='form-group' controlId="formResourceType">
        <Form.Label>Prompt Template</Form.Label>
        <div style={{marginBottom: '15px'}}>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Insert Input Variables
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {inputVariables.length === 0 && (
                        <Dropdown.Item>
                            <p>No Input Variables. <br></br> Connect Blocks to get input variables</p>
                        </Dropdown.Item>
                    )}
                    {inputVariables.map((variable, index) => (
                        <Dropdown.Item key={index} onClick={() => onInsertVariable(variable)}>
                            {variable}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <Form.Control
        as="textarea"
        rows={3}
        value={promptTemplate}
        onChange={onChangePromptTemplate}
        />
    </Form.Group>
   </>
  )
}