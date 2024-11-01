import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field } from 'formik';
import { createRunConfigForNode } from '../Workflows/Utils/CreateRunConfig';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

const instantRunBlock = async (
    runConfig,
    coreBlockType,
    processType,
    payload
) => {
    try {
        const response = await fetch('http://localhost:8000/instant_run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                run_config: runConfig,
                core_block_type: coreBlockType,
                process_type: processType,
                payload: payload
            })
        });
        return response
    } catch (error) {
        return error
    }
}

/**
 * InstantRun is a component that enables users to test a block's 
 * output. Users should be able to use this component with any block
 * that they want to immediately test.
 *
 * @param {{ blockData: object }} props - The props for the component.
 */
export const InstantRun = ({ blockData }) => {
    const [runResponse, setRunResponse] = useState(null);

  const handleButtonClick = async (values) => {
    const runConfig = createRunConfigForNode(blockData);
    const coreBlockType = blockData.core_block_type;
    const processType = blockData.process_type;
    const payload = values.payload;
    // make a post request to the backend
    const response = await instantRunBlock(
        runConfig, 
        coreBlockType, 
        processType, 
        payload
    );
    if (response.ok) {
        const resp = await response.json();
        setRunResponse(JSON.stringify(resp, null, 2));
    }
  };

  return (
    <>
        <p style={{marginBottom: '20px', fontWeight: '500', fontSize: '22px'}}>Preview</p>
        <Formik
        initialValues={{ payload: '' }}
        onSubmit={() => {}}
        >
        {({ handleChange, values }) => (
            <>
            <Form.Group className="form-group" controlId="formResourceType">
                <Form.Label>Payload</Form.Label>
                <Field
                as="textarea"
                name="payload"
                rows={3}
                className="form-control"
                onChange={handleChange}
                value={values.payload}
                />
            </Form.Group>
            <Button 
                type="button" 
                onClick={() => handleButtonClick(values)}
                style={{width: '100%'}}>
                Test
            </Button>
            </>
        )}
        </Formik>
        <div style={{marginTop: '25px'}}>
            {runResponse && 
            (
                <>
                    <p style={{marginBottom: '20px', fontWeight: '500', fontSize: '20px'}}>Output</p>
                    <JsonView 
                        data={JSON.parse(runResponse)} 
                        shouldExpandNode={allExpanded} 
                        style={defaultStyles} 
                    />
                </>
            )}
        </div>
    </>
  );
};
