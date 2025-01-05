import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Tooltip, IconButton } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRegEdit } from 'react-icons/fa';
import { CiPause1 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useAuth } from '../../../contexts/AuthContext';
import './TemplatePage.css';

const TemplatePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { token, logout } = useAuth();

  const handleClickTemplate = (data) => {
    navigate(`/run/${data.id}`, {state: {deployment_url: data.deployment_url}})
  }

  const pauseWorkflow = (data) => {
    fetch(`http://localhost:8000/pause_workflow/${data.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}` 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        const updatedUrl = data.deployment_url
        const id = data.template_id
        setData((prevData) => 
          prevData.map((item) =>
            item.id === id
            ? { ...item, deployment_url: updatedUrl} // Update only deployment_url
            : item // Keep the other items unchanged
          )
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  const resumeWorkflow = (data) => {
    fetch(`http://localhost:8000/resume_workflow/${data.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}` 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        const updatedUrl = data.deployment_url
        const id = data.template_id
        setData((prevData) => 
          prevData.map((item) =>
            item.id === id
            ? { ...item, deployment_url: updatedUrl} // Update only deployment_url
            : item // Keep the other items unchanged
          )
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  const deleteWorkflow = (data) => {
    fetch(`http://localhost:8000/delete_workflow/${data.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        const id = data.template_id
        setData((prevData) => 
          prevData.filter((item) => item.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  const openTracer = (data) => {
    navigate(`/trace/${data.id}`)
  }

  const editWorkflow = (data) => {
    const template = {
      id: null,
      name: data.name,
      description: data.description,
      nodes: data.frontend_template.nodes,
      edges: data.frontend_template.edges,
      reference_template_id: data.id
    }
    // check if a draft already exists
    fetch(`http://localhost:8000/draft_exists/${data.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists === true) {
          console.log("Draft exists")
          navigate('/workflow', { state: { type: 'draft', template: data.template } })
        }
        else {
          console.log("No draft exists")
          navigate('/workflow', { state: { type: 'edit', template: template } })
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  useEffect(() => {
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setData(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }, [])
  return (
    <div className='page-main-container' style={{'height': '100vh'}}>
      <h2>Templates</h2>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Name</TableCell>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Description</TableCell>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Server Endpoint</TableCell>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Logs</TableCell>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
              >
                <TableCell component="th" scope="row" onClick={() => handleClickTemplate(item)}>
                  {item.name}
                </TableCell>
                <TableCell onClick={() => handleClickTemplate(item)}>{item.description}</TableCell>
                <TableCell>{item.deployment_url}</TableCell>
                <TableCell>
                    <Tooltip>
                        <IconButton onClick={() => openTracer(item)}>
                          <RxActivityLog size={20} title='Open Tracer'className='template-action'/>
                        </IconButton> 
                    </Tooltip>
                </TableCell>
                <TableCell>
                    {
                      item.deployment_url ? 
                      <Tooltip>
                          <IconButton onClick={() => pauseWorkflow(item)}>
                            <CiPause1 size={20} title='Stop Template' className='template-action'/>  
                          </IconButton> 
                      </Tooltip>
                      :
                      <Tooltip>
                          <IconButton onClick={() => resumeWorkflow(item)}>
                            <FaPlay size={20} title='Run Template' className='template-action'/>
                          </IconButton> 
                      </Tooltip> 
                    }
                    <Tooltip>
                        <IconButton onClick={() => editWorkflow(item)}>
                          <FaRegEdit size={20} title='Edit Template' className='template-action'/>
                        </IconButton> 
                    </Tooltip>
                    <Tooltip>
                        <IconButton onClick={() => deleteWorkflow(item)}>
                          <MdDelete size={20} title='Delete Template' className='template-action'/>
                        </IconButton> 
                    </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '100px', fontWeight: '300'}}>There are no templates.</p>
        ) : null}
    </div>
  )
}

export default TemplatePage