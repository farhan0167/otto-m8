import React from 'react'
import { Card, CardContent, Typography, ButtonGroup, Button, Box, Divider, Tooltip, IconButton } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { getExampleTemplates } from './exampleTemplates';
import { IoIosRocket } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  ];

const Home = () => {
    const exampleTemplates = getExampleTemplates();

  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', marginBottom: '20px' }}>
            <ButtonGroup variant="outlined" aria-label="Loading button group" size='large'>
                <Button>Import</Button>
                <Button onClick={() => window.location.href = '/workflow'}>Create Workflow</Button>
            </ButtonGroup>
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
                    <Grid key={index} item xs={6} lg={6}>
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
                                    <IconButton>
                                    <FaRegEdit size={25} title='Edit Template'/>
                                    </IconButton> 
                                </Tooltip>
                                <Tooltip>
                                    <IconButton>
                                    <IoIosRocket size={25} title='Deploy'/>
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
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>

                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        hover
                        >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
        </div>
      </div>
    </>
  );
}

export default Home;
