import React, { useEffect, useState } from 'react'
import { Dropdown, Form } from 'react-bootstrap';

export const  MultimodalSelector = ({blockData, connectedSourceNodes, onDataChange}) => {
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
        setImageInputVariable(blockData.image_input);
        setTextInputVariable(blockData.text_input);
    }, [blockData]);

    const onChangeImageInputVariable = (variable) => {
        setImageInputVariable(variable);
        onDataChange('image_input', variable);
    }

    const onChangeTextInputVariable = (variable) => {
        setTextInputVariable(variable);
        onDataChange('text_input', variable);
    }

  return (
   <>
        <Form.Label>Configure Inputs</Form.Label>
        <hr></hr>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p>Image:</p> 
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
        <hr></hr>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p>Text:</p> 
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
        <hr></hr>
   </>
  )
}