import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaPlay, FaEdit, FaTrash, FaPause } from 'react-icons/fa';
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
    <div style={{'height': '100vh'}}>
      <h2>Templates</h2>
      <Table hover>

      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Server Endpoint</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data? data.map((item) => (

              <tr key={item.id}>
                  <td>
                    
                  </td>
                  <td>
                    <p onClick={() => handleClickTemplate(item)}>{item.name}</p>
                  </td>
                  <td>
                    <p onClick={() => handleClickTemplate(item)}>{item.description}</p>
                  </td>
                  <td>
                    <p>
                      <a href={item.deployment_url} target='_blank'>
                        {item.deployment_url}
                      </a>
                    </p>
                  </td>
                  <td className='table-row-actions'>
                    {
                      item.deployment_url ? 
                      <FaPause title='Stop Template' className='template-action' onClick={() => pauseWorkflow(item)}/> 
                      : <FaPlay title='Run Template' className='template-action' onClick={() => resumeWorkflow(item)}/>
                    }
                    <FaEdit title='Edit Template' className='template-action'/>
                    <FaTrash title='Delete Template' className='template-action' onClick={() => deleteWorkflow(item)}/>
                  </td>
                </tr>

        )): <p>Loading..</p>}
      </tbody>
      </Table>
      {data.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '100px', fontWeight: '300'}}>There are no templates.</p>
        ) : null}
    </div>
  )
}

export default TemplatePage