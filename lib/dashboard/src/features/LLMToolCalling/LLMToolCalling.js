
import React, { useState, useEffect } from 'react'
import { Button, Form, ListGroup, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import { AddBlockComponent } from '../../components/BlockConfigBar/AddBlockSidebar';
import { NodeConfigurationComponent } from '../../components/BlockConfigBar/NodeSidebar';
import { createRunConfigForNode } from '../../components/Pages/Workflows/Utils/CreateRunConfig';

export const LLMToolCalling = ({ onDataChange, tools }) => {
    const [toolData, setToolData] = useState(tools.tools);
    const [selectedTool, setSelectedTool] = useState(null);
    const [showToolConfig, setShowToolConfig] = useState(false);

    useEffect(() => {
        setToolData(tools.tools);
    }, [tools]);

    const handleOpenToolConfig = (tool = null) => {
        setSelectedTool(tool);
        setShowToolConfig(true);
    };

    const handleCloseToolConfig = () => {
        setSelectedTool(null);
        setShowToolConfig(false);
    };

    return (
        <>
            {toolData.length > 0 && <h4>Tools</h4>}
            <ListGroup>
                {toolData.map((tool, index) => (
                    <ListGroup.Item
                        key={index}
                        button={true}
                        onClick={() => handleOpenToolConfig(tool)}
                    >
                        {tool.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Button
                onClick={() => handleOpenToolConfig()}
                style={{ marginTop: '20px', width: '100%' }}
            >
                Add Tool
            </Button>
            {showToolConfig && (
                <ToolConfig
                    show={showToolConfig}
                    handleClose={handleCloseToolConfig}
                    toolData={toolData}
                    setToolData={setToolData}
                    reactFlowOnDataChange={onDataChange}
                    selectedTool={selectedTool}
                />
            )}
        </>
    );
};

export const ToolConfig = ({
    show,
    handleClose,
    toolData,
    setToolData,
    reactFlowOnDataChange,
    selectedTool,
}) => {
    const isEditing = !!selectedTool;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Tool' : 'Add a Tool'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: selectedTool?.name || '',
                        description: selectedTool?.description || '',
                        params: selectedTool?.params || [],
                        integrated_with: selectedTool?.integrated_with || null,
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.name) {
                            errors.name = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            let updatedTools;
                            if (isEditing) {
                                updatedTools = toolData.map((tool) =>
                                    tool.name === selectedTool.name ? values : tool
                                );
                            } else {
                                updatedTools = [...toolData, values];
                            }
                            setToolData(updatedTools);
                            setSubmitting(false);
                            handleClose();
                            reactFlowOnDataChange('tools', updatedTools);
                        }, 400);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="form-group">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                />
                                {errors.name && touched.name && <div className="text-danger">{errors.name}</div>}

                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                            </Form.Group>
                            <hr />
                            {values.params.map((param, index) => (
                                <Form.Group key={index}>
                                    <Form.Label>Param Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`params[${index}].name`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={param.name}
                                    />
                                    <Form.Label>Param Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`params[${index}].description`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={param.description}
                                    />
                                </Form.Group>
                            ))}
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setFieldValue('params', [
                                        ...values.params,
                                        { name: '', description: '' },
                                    ])
                                }
                            >
                                Add Param
                            </Button>
                            <hr />
                            {!values.integrated_with && (
                                <Button
                                    style={{ marginTop: '10px' }}
                                    onClick={() => setFieldValue('integrated_with', {})}
                                >
                                    Add a Connection
                                </Button>
                            )}
                            {values.integrated_with && (
                                <ToolConnectComponent
                                    integrated_with={values.integrated_with}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            <hr />
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default LLMToolCalling;

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