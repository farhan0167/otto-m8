import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap';

export const  MultimodalSelector = ({
    field,
    blockData,
    connectedSourceNodes,
    onDataChange
}) => {
    const [inputVariables, setInputVariables] = useState([]);
    const [ imageInputVariable, setImageInputVariable ] = useState('');
    const [ textInputVariable, setTextInputVariable ] = useState('');

    useEffect(() => {
        if (connectedSourceNodes && connectedSourceNodes.length > 0) {
            const inputVariables = connectedSourceNodes.map((node) => {
                return `${node.data.custom_name}`;
            });
            setInputVariables(inputVariables);
        }
    }, [connectedSourceNodes]);


    useEffect(() => {
        //setImageInputVariable(blockData.image_input);
        setImageInputVariable(blockData[field.image.name])
        setTextInputVariable(blockData[field.text.name]);
    }, [blockData]);

    const onChangeImageInputVariable = (variable) => {
        setImageInputVariable(variable);
        onDataChange(field.image.name, variable);
    }

    const onChangeTextInputVariable = (variable) => {
        setTextInputVariable(variable);
        onDataChange(field.text.name, variable);
    }

  return (
   <>
        <Form.Label>{field.display_name}</Form.Label>
        <hr></hr>
        {field.image && (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p>{field.image.display_name}</p> 
                <Dropdown>
                        <Dropdown.Toggle  style={{ backgroundColor: 'transparent', color: 'black' }} variant="primary" id="dropdown-basic">
                            {imageInputVariable ? imageInputVariable : 'Map Image Input'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {inputVariables.length === 0 && (
                                <Dropdown.Item>
                                    <p>No Input Variables. <br></br> Connect Blocks to get input variables</p>
                                </Dropdown.Item>
                            )}
                            {inputVariables.map((variable, index) => (
                                <Dropdown.Item key={index} onClick={()=> onChangeImageInputVariable(variable)}>
                                    {variable}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                </Dropdown>
            </div>
        )}
        <hr></hr>
        {field.text && (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p>{field.text.display_name}</p> 
                <Dropdown>
                        <Dropdown.Toggle  style={{ backgroundColor: 'transparent', color: 'black' }} variant="primary" id="dropdown-basic">
                            {textInputVariable ? textInputVariable : 'Map Text Input'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {inputVariables.length === 0 && (
                                <Dropdown.Item>
                                    <p>No Input Variables. <br></br> Connect Blocks to get input variables</p>
                                </Dropdown.Item>
                            )}
                            {inputVariables.map((variable, index) => (
                                <Dropdown.Item key={index} onClick={()=> onChangeTextInputVariable(variable)}>
                                    {variable}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                </Dropdown>
            </div>
        )}
        <hr></hr>
   </>
  )
}