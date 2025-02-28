
import React, { useState, useEffect } from 'react'
import { Button, ListGroup } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import { IconButton, Tooltip, Modal, Box, Typography } from '@mui/material';
import LLMToolCalling from '../LLMToolCalling';

export const ToolCalling = ({
    field,
    blockData,
    onDataChange
 }) => {
    const [tools, setTools] = useState(blockData[field.name]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [selectedToolIndex, setSelectedToolIndex] = useState(null);
    const [showToolConfig, setShowToolConfig] = useState(false);

    useEffect(() => {
        setTools(blockData[field.name]);
    }, [blockData]);

    const handleOpenToolConfig = (tool = null, index = null) => {
        setSelectedTool(tool);
        setSelectedToolIndex(index);
        setShowToolConfig(true);
    };

    const handleCloseToolConfig = () => {
        setSelectedTool(null);
        setShowToolConfig(false);
    };

    const handleDeleteTool = (toolIndex) => {
        const updatedTools = tools.filter((_, index) => index !== toolIndex);
        setTools(updatedTools);
        onDataChange(field.name, updatedTools);
    };

    return (
        <>
            {tools.length > 0 && <h4>Tools</h4>}
            <ListGroup>
                {tools.map((tool, index) => (
                    <ListGroup.Item
                        key={index}
                        button={true}
                        style={{ padding: '5px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Tooltip>
                                <Button 
                                    style={{backgroundColor: 'transparent', color: 'black' , border: 'none'}}
                                    onClick={() => handleOpenToolConfig(tool, index)}
                                >
                                    {tool.name}
                                </Button>
                            </Tooltip>
                            <Tooltip>
                                <IconButton onClick={() => handleDeleteTool(index)}>
                                    <MdDelete size={20}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        
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
                <ToolConfigModal
                    show={showToolConfig}
                    handleCloseToolConfig={handleCloseToolConfig}
                    field={field}
                    tools={tools}
                    setTools={setTools}
                    reactFlowOnDataChange={onDataChange}
                    selectedTool={selectedTool}
                    selectedToolIndex={selectedToolIndex}
                />
            )}
        </>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

export const ToolConfigModal = ({
    show,
    handleCloseToolConfig,
    field,
    tools,
    setTools,
    reactFlowOnDataChange,
    selectedTool,
    selectedToolIndex
}) => {
    const isEditing = !!selectedTool;

    return (
        <Modal open={show} onClose={handleCloseToolConfig}>
        <Box sx={modalStyle}>
            <Box>
                <Typography variant='h5'>{isEditing ? 'Edit Tool' : 'Add a Tool'}</Typography>
            </Box>
            <Box>
                <LLMToolCalling
                    field={field}
                    tools={tools}
                    setTools={setTools}
                    reactFlowOnDataChange={reactFlowOnDataChange} 
                    selectedTool={selectedTool}
                    selectedToolIndex={selectedToolIndex}
                    handleCloseToolConfig={handleCloseToolConfig}
                />
            </Box>
        </Box>
        </Modal>
    );
};