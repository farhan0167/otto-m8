
import React, { useState } from 'react'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { Formik } from 'formik';

export const LLMToolCalling = ({ onDataChange }) => {
    const [showAddTool, setShowAddTool] = useState(false);
    const handleCloseAddTool = () => setShowAddTool(false);
    const handleShowAddTool = () => setShowAddTool(true);

    const [showTool, setShowTool] = useState(false);
    const handleCloseTool = () => setShowTool(false);
    const handleShowTool = (index) => {
        console.log(index);
        setShowTool(true);
    };

    const [toolData, setToolData] = useState([]);


  return (
    <>
        {toolData.length > 0 ? (
            <h4>Tools</h4>
        ): null}

        <ListGroup>
            {toolData? toolData.map((tool, index) => (
                <ListGroup.Item key={index} button={true} onClick={() => handleShowTool(index)}>
                    {tool.name}
                </ListGroup.Item>
            )) : null}
            <Tool showTool={showTool} handleCloseTool={handleCloseTool} />
        </ListGroup>
        <Button onClick={handleShowAddTool}
            style={{marginTop: '20px', width: '100%'}}
        >
            Add Tool
        </Button>
        <ToolConfig 
            showAddTool={showAddTool} 
            handleCloseAddTool={handleCloseAddTool} 
            setShowAddTool={setShowAddTool}
            toolData={toolData}
            setToolData={setToolData}
            reactFlowOnDataChange={onDataChange}
        />
    </>
  )
}

export default LLMToolCalling


export const ToolConfig = ({
    showAddTool, 
    setShowAddTool, 
    handleCloseAddTool, 
    toolData, 
    setToolData,
    reactFlowOnDataChange
}) => {
  return (
    <Modal show={showAddTool} onHide={handleCloseAddTool} size="lg" centered>
        <Modal.Header closeButton>
        <Modal.Title>Add a Tool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik 
            initialValues={{
                name: '',
                description: '',
                params: [] // Adding params array
            }}
            validate={(values) => {
                const errors = {};
                if (values.name === '') {
                    errors.name = 'Required';
                }
                setShowAddTool(true);
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    // Append the form values (including params) to tool data
                    const newToolData = [...toolData, values]
                    setToolData(newToolData);
                    setSubmitting(false);
                    handleCloseAddTool();
                    reactFlowOnDataChange('tools', newToolData)
                }, 400);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formResourceType">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                        />
                        {errors.name && touched.name && errors.name}

                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                        />
                        {errors.description && touched.description && errors.description}
                    </Form.Group>

                    <hr/>

                    {/* Render form controls for each param */}
                    {values.params.length > 0 && values.params.map((param, index) => (
                        <Form.Group controlId={`formParam${index}`} key={index}>
                            <Form.Label>Param Name</Form.Label>
                            <Form.Control
                                type="text"
                                name={`params[${index}].name`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={param.name}
                            />
                            {errors.params && errors.params[index] && errors.params[index].name && touched.params 
                            && touched.params[index] && touched.params[index].name && errors.params[index].name}

                            <Form.Label>Param Description</Form.Label>
                            <Form.Control
                                type="text"
                                name={`params[${index}].description`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={param.description}
                            />
                            {errors.params && errors.params[index] && errors.params[index].description && touched.params 
                            && touched.params[index] && touched.params[index].description && errors.params[index].description}

                            {/* Using React-Bootstrap's Form.Select for each param */}
                            <Form.Label>Param Type</Form.Label>
                            <Form.Select
                                name={`params[${index}].type`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={param.type || ''} // Default to empty string if undefined
                            >
                                <option value="">Select a type</option>
                                <option value="string">String</option>
                                <option value="integer">Integer</option>
                                <option value="float">Float</option>
                                <option value="boolean">Boolean</option>
                                <option value="list">List</option>
                                <option value="object">Object</option>
                            </Form.Select>
                            <hr/>
                        </Form.Group>
                    ))}

                    {/* Button to add a new param */}
                    <Button
                        variant="secondary"
                        onClick={() => {
                            // Add a new param to the params array
                            setFieldValue("params", [...values.params, { name: '', description: '' }]);
                        }}
                    >
                        Add Param
                    </Button>
                    <hr/>
                    <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleCloseAddTool} type="submit" disabled={isSubmitting}>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>

        </Modal.Body>
        
    </Modal>
  )
}

const Tool = ({showTool, handleCloseTool}) => {
  return (
    <Modal show={showTool} onHide={handleCloseTool} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseTool}>
            Close
        </Button>
        </Modal.Footer>
    </Modal>
  )
}