import React, { useEffect, useState } from 'react'
import { 
    Box,
    FormControl, InputLabel, MenuItem, Select
 } from '@mui/material'
import { 
    fetch_task_registry,
    fetch_block_data
 } from '../../api/blocks'
import { NodeConfigurationComponent } from '../BlockConfigBar/NodeSidebar';

const ToolBlockConnection = ({
    toolConnectedWith,
    setToolConnectedWith,
    selectedBlockDisplayName,
    setSelectedBlockDisplayName,
    disabled
}) => {
    const [blockData, setBlockData] = useState(Object);
    const [selectedBlockData, setSelectedBlockData] = useState(toolConnectedWith);

    useEffect(() => {
        setToolConnectedWith(selectedBlockData)
    }, [selectedBlockData])

    useEffect(() => {
        const get_blocks_from_registry = async () => {
            const blocks = await fetch_task_registry()
            setBlockData(blocks)
        }
        get_blocks_from_registry()
    }, [])

    const initializeBlockData = async (blockMetadata) => {
        //setConnectionData({'core_block_type': blockMetadata.core_block_type})
        const core_block_type = blockMetadata.core_block_type
        const process_type = blockMetadata.process_type
        const nodeType = blockMetadata.ui_block_type

        let block_data = await fetch_block_data(core_block_type, process_type)

        block_data.id = Math.random().toString(36).substr(2, 5);
        block_data.type = nodeType;
        block_data.process_type = process_type;
        block_data.data.core_block_type =  core_block_type;
        setSelectedBlockData(block_data.data)
    }

    const handleOnSelectFromConnectionsDropdown = (blockName, blockMetadata) => {
        setSelectedBlockDisplayName(blockName)
        initializeBlockData(blockMetadata)
    }

    const onSelectedBlockDataChange = (key, value) => {
        setSelectedBlockData((prev) => ({ ...prev, [key]: value }));
    };
    
  return (
    <>
        <Box>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select a Block to connect with</InputLabel>
                <Select
                    label="block"
                    value={selectedBlockDisplayName}
                    disabled={disabled}
                    //onChange={(e) => setSelectedBlock(e.target.value)}
                >
                    {Object.entries(blockData).map(([vendorName, Blocks]) => 
                        Object.entries(Blocks).map(([blockName, blockMetadata]) => (
                            <MenuItem 
                            key={`${vendorName}-${blockName}`} 
                            value={blockName} 
                            onClick={() => handleOnSelectFromConnectionsDropdown(blockName, blockMetadata)}>
                                {blockName}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
        </Box>
        <Box>
            {selectedBlockData && <NodeConfigurationComponent 
                blockDataConfig={selectedBlockData}
                onDataChange={disabled === true ? null : onSelectedBlockDataChange}
            />}
        </Box>

    </>
  )
}

export default ToolBlockConnection