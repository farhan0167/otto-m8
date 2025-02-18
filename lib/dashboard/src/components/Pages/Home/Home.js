import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, ButtonGroup, 
    Button, Box, Divider, Tooltip, IconButton,
    Stack, Container 
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import getExampleTemplates  from './examples.json';


import { IoIosRocket } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";


import { useNavigate } from "react-router-dom";
import { NewTemplate } from './newTemplate';
import { useAuth } from '../../../contexts/AuthContext';
import { fetch_block_data } from '../../../utils/workflow/get_block_data';
import { Position } from "@xyflow/react";


const Home = () => {
    const navigate = useNavigate();
    const exampleTemplates = getExampleTemplates['examples'];

    const { token, logout } = useAuth();
    const [draftWorkflows, setDraftWorkflows] = useState([]);

    const createNewWorkflow = async () => {
        const nodeDefaults = {
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
        // TODO: Refactor the block initialization process into utils directory.
        const getInitialDataTextInput = async () => {
            const core_block_type = 'text_input';
            const process_type = 'task';
            let block_data = await fetch_block_data(core_block_type, process_type);
            block_data.id = '1';
            block_data.data.label = 'Input Block';
            block_data.data.custom_name = 'user_input';
            block_data.data.core_block_type = core_block_type;
            block_data.data.process_type = process_type;
            return block_data
          }
          let initialDataTextInput = await getInitialDataTextInput();
          initialDataTextInput = {...initialDataTextInput, ...nodeDefaults};
        const template = NewTemplate();
        template.nodes.push(initialDataTextInput);
        navigate('/workflow', { state: { type: 'new', template: template } });
    }

    const createExampleWorkflow = (template) => {
        navigate('/workflow', { state: { type: 'preset', template: template } });
    }

    const openDraftWorkflow = (template) => {
        navigate('/workflow', { state: { type: 'draft', template: template } });
    }

    const deleteDraftWorkflow = async (template_id) => {
        try {
            const response = await fetch(`http://localhost:8000/delete_draft_workflow/${template_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDraftWorkflows([...draftWorkflows.filter((draft) => draft.id !== template_id)]);
            }
            else {navigate('/')}
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // TODO: Placeholder quick fix so that user doesnt work on workflow while not logged in, else they'll be kicked out.
        fetch('http://localhost:8000/templates', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}` 
            },
        })
            .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                logout();
                }
            }
            });
    })

    useEffect(() => {
        const fetchDraftWorkflows = async () => {
            try {
                const response = await fetch('http://localhost:8000/get_draft_workflows', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json', 
                        "Authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                setDraftWorkflows(data);
            } catch (error) {
                console.error('Error fetching draft workflows:', error);
            }
        };
        fetchDraftWorkflows();
    }, []);

  return (
    <>
        <Container fluid maxWidth='xl'>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '20px' }}>
                <Stack 
                    variant="outlined" aria-label="Loading button group" size='large' 
                    direction="row" spacing={1} sx={{
                        height: '40px', marginRight: '30px', padding: '20px'
                    }}
                    xs={12}
                >
                    <Button color='primary' variant='contained'>Import</Button>
                    <Button color='primary' variant='contained' sx={{width: '200px'}} onClick={() => createNewWorkflow()}>New Workflow</Button>
                </Stack>
            </Box>
            <div style={{ paddingRight: '20%' }}>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                Get Started
                </Typography>
                <Typography variant="body1" paragraph>
                Pick a template to get started or create your own.
                </Typography>

                <Grid container spacing={3}>
                    {exampleTemplates.map((template, index) => (
                        <Grid key={index} xs={6} lg={6}>
                        <Card sx={{ maxWidth: 345, padding: '10px', paddingBottom: '0', borderRadius: '12px' }} raised>
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {template.description}
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '10px' }}>
                                    <Tooltip>
                                        <IconButton>
                                        <IoMdEye size={25} title='Preview'/>
                                        </IconButton> 
                                    </Tooltip>
                                    <Tooltip>
                                        <IconButton onClick={() => createExampleWorkflow(template)}>
                                        <FaRegEdit size={25} title='Edit Template'/>
                                        </IconButton> 
                                    </Tooltip>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>
            
                <div style={{ marginTop: '50px' }}>
                    <Typography variant="h5" gutterBottom fontWeight={500}>
                    Work in progress
                    </Typography>
                    <Divider />
                    <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Date Created</TableCell>
                            <TableCell align="right">Date Last Modified</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {draftWorkflows.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            hover
                            >
                            <TableCell component="th" scope="row" onClick={() => openDraftWorkflow(row)}>
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.date_created}</TableCell>
                            <TableCell align="right">{row.date_modified}</TableCell>
                            <TableCell align="right">
                                <Tooltip>
                                    <IconButton onClick={() => deleteDraftWorkflow(row.id)}>
                                    <MdDelete size={20} title='Delete'/>
                                    </IconButton> 
                                </Tooltip>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    {draftWorkflows.length === 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Typography gutterBottom sx={{ fontWeight: 300, marginTop: '60px' }}>
                            No draft workflows. Create a new one.
                            </Typography>
                        </div>
                    )}
                    </TableContainer>
            </div>
        </div>
    </Container>
    </>
  );
}

export default Home;
