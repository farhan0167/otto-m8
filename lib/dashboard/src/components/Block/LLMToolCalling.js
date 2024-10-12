
import React, { useState, useEffect } from 'react'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { AddBlockComponent } from '../BlockConfigBar/AddBlockSidebar';
import { NodeConfigurationComponent } from '../BlockConfigBar/NodeSidebar';
import { createRunConfigForNode } from '../Workflows/Utils/CreateRunConfig';

/**
 * A component that displays a list of tools and allows the user to add a new tool. 
 * When a tool is clicked, it shows the tool's configuration(to be implemented). When the Add Tool 
 * button is clicked, it shows a modal to add a new tool.
 *
 * @param {{ onDataChange: (data: Object) => void, tools: Object }} props
 * @returns {JSX.Element}
 */
export const LLMToolCalling = ({ onDataChange, tools }) => {
    const [showAddTool, setShowAddTool] = useState(false);
    const handleCloseAddTool = () => setShowAddTool(false);
    const handleShowAddTool = () => setShowAddTool(true);

    const [showTool, setShowTool] = useState(false);
    const handleCloseTool = () => setShowTool(false);
    const handleShowTool = (index) => {
        console.log(index);
        setShowTool(true);
    };

    const [toolData, setToolData] = useState(tools.tools);

    useEffect(() => {
        setToolData(tools.tools);
    }, [tools]);


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


/**
 * A Modal component that handles adding a new tool to the tool data.
 * 
 * The component renders a form with fields for the tool's name, description, and parameters.
 * The form also includes a button to add a new parameter.
 * Additionally, the form includes a button to add a connection to the tool.
 * When the form is submitted, the new tool is added to the tool data and the modal is closed.
 * 
 * @param {boolean} showAddTool - Whether or not to show the modal.
 * @param {function} setShowAddTool - A function to set the showAddTool state.
 * @param {function} handleCloseAddTool - A function to close the modal.
 * @param {array} toolData - The current tool data.
 * @param {function} setToolData - A function to set the tool data.
 * @param {function} reactFlowOnDataChange - A function to call when the tool data changes to directly
 * update the React Flow data.
 */
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
                params: [], // Adding params array,
                integrated_with: null
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
                <div>
                <Form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-end">
                            <Button variant="primary" onClick={handleCloseAddTool} type="submit" disabled={isSubmitting}>
                                Save Changes
                            </Button>
                    </div>
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
                    
                </Form>
                {!values.integrated_with && (
                    <Button 
                    style={{marginTop: "10px"}}
                    onClick={() => setFieldValue("integrated_with", {})}>
                        Add a Connection
                    </Button>
                )}
                {values.integrated_with && (
                    <ToolConnectComponent integrated_with={values.integrated_with} setFieldValue={setFieldValue}/>
                )}
                <hr/>
                
                </div>
                
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

export const FetchIntegrationsRegistry = async () => {
    try {
        const response = await fetch('http://localhost:8000/get_integration_block_types',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching integrations registry:', error);
        return null;
    }
}

    /**
     * ToolConnectComponent is a component that renders a form for selecting and configuring
     * an integration block. The component fetches the integrations registry from the server and
     * provides a dropdown menu of available integration blocks. When an integration block is selected,
     * the component renders a form for configuring the block based on its `sideBarData` prop.
     * 
     * @param {Object} integrated_with The current integration block data in Formik values.integrated_with.
     * @param {Function} setFieldValue The Formik function to call when the form is submitted.
     */
const ToolConnectComponent = ({integrated_with, setFieldValue}) => {
    // connectionData: state of the integration block used for the form
    const [connectionData, setConnectionData] = useState(integrated_with)
    const [integrationsRegistry, setIntegrationsRegistry] = useState({})
    // finalConnectionData: holds a copy of connectionData with the run_config added.
    // This enables us to use this data without impacting form data changes.
    const [finalConnectionData, setFinalConnectionData] = useState(null)

    const getIntegrationsRegistry = async () => {
        const blockTypes = await FetchIntegrationsRegistry()
        if (blockTypes) {
            setIntegrationsRegistry(blockTypes)
        }
    };
    /**
     * Handler for when user selects an integration block from the dropdown, to 
     * initialize the integration block with its data.
     * 
     * @param {string} data The integration block (core_block_type) type to select.
     */
    const handleSelectNode = (data) => {
        setConnectionData({'core_block_type': data})
    }

    const onConnectionDataChange = (key, value) => {
        setConnectionData((prev) => ({ ...prev, [key]: value }));
    };
    
    useEffect(() => {
        getIntegrationsRegistry()
    }, [])

    /**
     * Makes the final connection data by creating a run configuration for the current
     * connectionData and setting it to the Formik field `integrated_with`. The reason
     * we are doing this is because run config itself is not part of the form, but a metadata
     * we are adding to the Tool data. By directly changing connectionData with run config,
     * messes the form data changes from showing. Therefore any post processing of the data
     * is passed to the finalConnectionData
     */
    const makeFinalConnectionData = () => {
        let run_config = createRunConfigForNode(connectionData)
        setFinalConnectionData(run_config)
        setFieldValue("integrated_with", {...connectionData, ...{run_config: run_config}})
    }

    return (
        <div style={{marginTop: '20px'}}>
            <div>
                <p style={{fontWeight: '700', fontSize: '18px'}}>Choose an Integration</p>
                <AddBlockComponent blocksData={integrationsRegistry} handleSelectNode={handleSelectNode} />
            </div>

            <div style={{marginTop: '20px'}}>
                <NodeConfigurationComponent blockDataConfig={connectionData} onDataChange={onConnectionDataChange}/>
            </div>
            {!finalConnectionData && (
                <Button 
                style={{marginTop: "10px"}}
                onClick={makeFinalConnectionData}
                >
                    Make Connection
                </Button>
            )}
            
        </div>    
    )
}