import React from 'react'
import { 
    Box, TextField, Button, 
    Typography, Divider, MenuItem, 
    Checkbox, FormControlLabel,
    Tooltip, IconButton
 } from '@mui/material'
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import './styles.css'

const disabledStyles = (disabled) => {
    if (disabled) {
        return {
            ".Mui-disabled": {
                color: "black"
            },
            ".MuiInputBase-input-MuiInput-input.Mui-disabled": {
                color: "black", // (default alpha is 0.38)
                opacity: 1
            }
        }
    }
}

const ToolConfig = ({
    toolName, toolDescription, toolParams,
    setToolName, setToolDescription, setToolParams,
    disabled
}) => {
    const handleAddParam = () => {
        setToolParams([
            ...toolParams,
            {
                name: '',
                description: '',
                type: 'string',
                required: false
            }
        ])
    }
  return (
    <>
        <div className='tool-form-fields'>
            <TextField
                id="outlined-basic"
                label="Tool Name"
                variant="standard"
                sx={{ width: '25ch', ...disabledStyles(disabled)}}
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                required
                disabled={disabled}
            />
        </div>
        <div className='tool-form-fields'>
            <TextField
                id="outlined-basic"
                label="Tool Description"
                variant="standard"
                multiline
                sx={{ width: '100%', ...disabledStyles(disabled)}}
                value={toolDescription}
                onChange={(e) => setToolDescription(e.target.value)}
                disabled={disabled}
            />
        </div>
        <div className='tool-form-fields' style={{marginTop: '35px'}}>
            <Typography variant="h5" gutterBottom>
                Parameters
            </Typography>
            <Divider sx={{opacity: 0.7}}/>
            <ToolParams 
                toolParams={toolParams}
                setToolParams={setToolParams}
                disabled={disabled}
            />
        </div>

        <div style={{marginTop: '30px'}} className='tool-form-fields'>
            {disabled===false && (<Button
                variant="contained"
                startIcon={<IoIosAddCircleOutline />}
                onClick={handleAddParam}
                disabled={disabled}
            >
                Add Parameters
            </Button>)}
        </div>
    </>
  )
}

export default ToolConfig


export const ToolParams = ({
    toolParams, setToolParams, disabled
}) => {
    const handleChange = (e, index, param_meta) => {
        const { type, checked, value } = e.target;
        const newToolParams = [...toolParams];
    
        // Use `checked` instead of `value` for checkboxes
        newToolParams[index][param_meta] = type === 'checkbox' ? checked : value;
    
        setToolParams(newToolParams);
    };

    const handleDelete = (index) => {
        const newToolParams = [...toolParams];
        newToolParams.splice(index, 1);
        setToolParams(newToolParams);
    }
  return (
    <>
        { toolParams.length > 0 && toolParams.map((param, index) => (
            <div id={`tool-param-${index}`} key={index} className='tool-form-fields' style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'end'}}>
                <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="standard"
                    sx={{ width: '25ch', ...disabledStyles(disabled)}}
                    value={param.name}
                    onChange={(e)=> handleChange(e, index, 'name')}
                    disabled={disabled}
                />
                <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="standard"
                    multiline
                    sx={{ width: '100%', ...disabledStyles(disabled)}}
                    value={param.description}
                    onChange={(e)=> handleChange(e, index, 'description')}
                    disabled={disabled}
                />
                <TextField
                    id="outlined-basic"
                    label="Type"
                    variant="standard"
                    select
                    sx={{ width: '20ch', ...disabledStyles(disabled)}}
                    value={param.type}
                    onChange={(e)=> handleChange(e, index, 'type')}
                    disabled={disabled}
                >
                    <MenuItem key="string" value="string">string</MenuItem>
                    <MenuItem key="number" value="integer">integer</MenuItem>
                    <MenuItem key="number" value="float">float</MenuItem>
                    <MenuItem key="boolean" value="boolean">boolean</MenuItem>
                    <MenuItem key="array" value="list">list</MenuItem>
                    <MenuItem key="object" value="object">object</MenuItem>
                </TextField>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <FormControlLabel
                        control={<Checkbox
                            checked={param.required}
                            disabled={disabled}
                        />}
                        label="Required"
                        labelPlacement="start"
                        onChange={(e)=> handleChange(e, index, 'required')}
                    />
                    <Tooltip title="Delete" sx={{padding: "15px"}}>
                        <IconButton onClick={() => handleDelete(index)} disabled={disabled}>
                            <MdDelete size={20}/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div> 
            ))
        }
    </>
  )
}
