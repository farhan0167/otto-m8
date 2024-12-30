import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TraceView from './TraceView';
import { LuFileJson2 } from "react-icons/lu";
import { Button } from 'react-bootstrap';

const WorkflowTrace = () => {
    const params = useParams();
    const template_id = params.id;
    const [traces, setTraces] = useState([]);
    const [trace, setTrace] = useState(null);
    const [showTrace, setShowTrace] = useState(false);

    const { token, logout } = useAuth();

    const handleShowTrace = (trace) => {
        setTrace(trace);
        setShowTrace(true);
    };
    const handleCloseTrace = () => {
        setShowTrace(false);
        setTrace(null);
    };

    useEffect(() => {
        const fetchWorkflowTrace = async () => {
          try {
            const response = await fetch(`http://localhost:8000/trace/${template_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}` 
              },
            });
            const data = await response.json();
            console.log(data);
            setTraces(data);
          } catch (error) {
            console.error('Error fetching workflow trace:', error);
          }
        };
    
        fetchWorkflowTrace();
      }, [template_id, token]);

  return (
    <>  <div style={{'height': '100vh'}}>
            <h2>Trace</h2>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell size='small'>time started</TableCell>
                    <TableCell size='small'>time ended</TableCell>
                    <TableCell size='small'>total time&nbsp;(s)</TableCell>
                    <TableCell size='small'>trace</TableCell>

                </TableRow>
                </TableHead>
                <TableBody>
                {traces.length > 0 && traces.map((trace, index) => (
                    <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">{trace.start_timestamp}</TableCell>
                    <TableCell >{trace.end_timestamp}</TableCell>
                    <TableCell >{trace.execution_time}</TableCell>
                    <TableCell > 
                        <Button  
                            style={{backgroundColor: 'transparent', border: 'none', color: 'black'}} 
                            onClick={() => handleShowTrace(trace.log)}>
                                <LuFileJson2 size={20}/>
                        </Button> 
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <TraceView show={showTrace} setShow={setShowTrace} trace={trace} handleCloseTrace={handleCloseTrace}/>
        </div>
    </>
  )
}

export default WorkflowTrace