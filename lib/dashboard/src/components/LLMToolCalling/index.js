import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { 
    Button, Typography,
    FormControl, InputLabel, Select, MenuItem
 } from '@mui/material';
import ToolConfig from './ToolConfig';
import ToolBlockConnection from './BlockConnection';
import { createRunConfigForNode } from '../Pages/Workflows/Utils/CreateRunConfig';
import exampleTools from './exampleTools.json'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const modalStyle = {
    maxHeight: '60vh',
    minHeight: '60vh',
    overflowY: 'auto',
  };

{/**
selectedTool: {
    name: string,
    description: string,
    params: array,
    integrated_with: reactflow_block_data['data'],
}    
*/}

export default function LLMToolCalling({
    field,
    tools,
    setTools,
    reactFlowOnDataChange,
    selectedTool,
    selectedToolIndex,
    handleCloseToolConfig
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedToolData, setSelectedToolData] = useState(null);

  const [toolName, setToolName] = useState(selectedTool?.name || '');
  const [toolDescription, setToolDescription] = useState(selectedTool?.description || '');
  const [toolParams, setToolParams] = useState(selectedTool?.params || []);
  const [toolIntegratedWith, setToolIntegratedWith] = useState(selectedTool?.integrated_with || null);
  const [selectedBlockDisplayName, setSelectedBlockDisplayName] = useState(selectedTool?.selectedBlockDisplayName || '');

  useEffect(() => {
    if (selectedToolIndex !== null) {
        setTabIndex(2)
    }
  }, []);

  useEffect(() => {
    setSelectedToolData(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    const newToolData = {
        name: toolName,
        description: toolDescription,
        params: toolParams,
        integrated_with: toolIntegratedWith,
        selectedBlockDisplayName
    }
    setSelectedToolData(newToolData);
  }, [toolName, toolDescription, toolParams, toolIntegratedWith, selectedBlockDisplayName]);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleButtonNext = () => {
    if (tabIndex === 2) {
        return;
    }
    setTabIndex(tabIndex + 1);
  }

  const handleSaveTool = () => {
    if (!toolName) {
        return;
    }
    if (!toolIntegratedWith) {
        return;
    }
    let run_config = createRunConfigForNode(toolIntegratedWith);
    
    const newSelectedToolData = {
        name: toolName,
        description: toolDescription,
        params: toolParams,
        integrated_with: {
            ...toolIntegratedWith,
            run_config: run_config
        },
        selectedBlockDisplayName
    }

    const newTools = [...tools];
    if (selectedToolIndex === null) {
        newTools.push(newSelectedToolData);
    }
    else {
        newTools[selectedToolIndex] = newSelectedToolData;
    }
    setTools(newTools);
    reactFlowOnDataChange(field.name, newTools);
    handleCloseToolConfig();
  }

  const handleSelectExampleTool = (e) => {
    const exampleTool = e.target.value;
    setToolName(exampleTool.name)
    setToolDescription(exampleTool.description)
    setToolIntegratedWith(exampleTool.integrated_with)
    setToolParams(exampleTool.params)
    setSelectedBlockDisplayName(exampleTool.selectedBlockDisplayName)
  }

  return (
    <>
        <Box sx={{ width: '100%', ...modalStyle }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="1. Define" {...a11yProps(0)} />
                <Tab label="2. Connect to a Block" {...a11yProps(1)} />
                <Tab label="3. Preview" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={tabIndex} index={0}>
                <div>
                  <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Choose from template</InputLabel>
                      <Select
                          label="block"
                          onChange={handleSelectExampleTool}
                      >
                          {exampleTools.map((exampleTool, index) => (
                              <MenuItem 
                                  key={`example-tool-${index}`} 
                                  value={exampleTool} 
                              >
                                  {exampleTool.name}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                </div>
                <ToolConfig
                    toolName={toolName}
                    toolDescription={toolDescription}
                    toolParams={toolParams}
                    setToolName={setToolName}
                    setToolDescription={setToolDescription}
                    setToolParams={setToolParams}
                    disabled={false}
                />
            </CustomTabPanel>
            <CustomTabPanel value={tabIndex} index={1}>
                <ToolBlockConnection
                    selectedBlockDisplayName={selectedBlockDisplayName}
                    setSelectedBlockDisplayName={setSelectedBlockDisplayName}
                    toolConnectedWith={toolIntegratedWith}
                    setToolConnectedWith={setToolIntegratedWith}
                    disabled={false}
                />
            </CustomTabPanel>
            <CustomTabPanel value={tabIndex} index={2}>
                <ToolConfig
                    toolName={toolName}
                    toolDescription={toolDescription}
                    toolParams={toolParams}
                    disabled={true}
                />
                <Typography variant='h5' sx={{mb: '20px'}}>Tool is connected to:</Typography>
                <ToolBlockConnection
                    selectedBlockDisplayName={selectedBlockDisplayName}
                    setSelectedBlockDisplayName={setSelectedBlockDisplayName}
                    toolConnectedWith={toolIntegratedWith}
                    setToolConnectedWith={setToolIntegratedWith}
                    disabled={true}
                />
            </CustomTabPanel>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
            {tabIndex<2 ? (
                <Button 
                onClick={handleButtonNext}
                variant='outlined'
                >
                    Next
                </Button>
            ) : (
                <Button variant='outlined' onClick={handleSaveTool}>Save Tool</Button>
            )}
        </Box>
    </>
  );
}
