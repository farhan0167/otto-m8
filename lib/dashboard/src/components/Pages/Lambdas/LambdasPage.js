import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Tooltip, IconButton } from '@mui/material';

import { FaTrash } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";

import { CodeEditor } from './CodeEditor';

import CustomAlert from '../../Extras/CustomAlert';

const canDeployContainers = process.env.REACT_APP_CAN_DEPLOY_WORKFLOW

const LambdasPage = () => {
    // All available lambda functions:
    const [data, setData] = useState([]);
    // Modal show data
    const [showLambdaModal, setShowLambdaModal] = useState(false);
    const [lambdaId, setLambdaId] = useState(null);
    const default_code = `
def handler(event, context):
    pass
    `
    // Code that will be displayed for the modal
    const [code, setCode] = useState(default_code);
    // Name of the lambda that will be displayed for the modal
    const [lambdaName, setLambdaName] = useState('');

    const closeLambdaModal = () => {
        setCode(default_code);
        setLambdaName('');
        setLambdaId(null);
        setShowLambdaModal(false);
    };

    const handleClickLambda = (data) => {
        setCode(data.code);
        setLambdaName(data.name);
        setLambdaId(data.id);
        setShowLambdaModal(true); //should create another modal that handles logic for redeployment.
    }

    const deleteLambdaCall = async (data) => {
        const lambda_id = data.id
        try {
            const response = await fetch(`http://localhost:8000/delete_lambda/${lambda_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                // Uncomment and handle the 401 response as needed
                // if (response.status === 401) {
                //   logout();
                // }
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            // remove data from data state
            setData((prevData) => prevData.filter((item) => item.id !== lambda_id));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const deleteLambda = async (data) => {
        const response = await deleteLambdaCall(data);
        console.log(response);

    }
    const fetchLambdas = async () => {
        try {
          const response = await fetch('http://localhost:8000/get_lambdas', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // "Authorization": `Bearer ${token}`
            },
          });
  
          if (!response.ok) {
            // Uncomment and handle the 401 response as needed
            // if (response.status === 401) {
            //   logout();
            // }
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          console.log('Success:', data);
          setData(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
    const refreshLambdas = () => {
        fetchLambdas();
    }

    useEffect(() => {
        fetchLambdas();
      }, []);

  return (
    <div className='page-main-container' style={{'height': '100vh'}}>
      <h2>Lambdas</h2>
      <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
            style={{marginRight: '10px', backgroundColor: '#A9A9A9', borderColor: '#A9A9A9'}}
            onClick={() => refreshLambdas()}
        >
            <IoIosRefresh size={25}/>
        </Button>
        <Button 
            variant="primary"
            onClick={() => setShowLambdaModal(true)}
        >Create Lambda</Button>
      </div>
      <LambdaModal 
        showLambdaModal={showLambdaModal} 
        closeLambdaModal={closeLambdaModal}
        code={code}
        setCode={setCode}
        lambdaName={lambdaName}
        setLambdaName={setLambdaName}
        lambdaId={lambdaId}
        setLambdaId={setLambdaId}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}}>Name</TableCell>
              <TableCell sx={{fontWeight: 'bold', fontSize: '16px'}} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((data, index) => (
              <TableRow key={index} hover>
                <TableCell onClick={() => handleClickLambda(data)}>{data.name}</TableCell>
                <TableCell align='right'>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => deleteLambda(data)}>
                      <FaTrash size={20} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '100px', fontWeight: '300'}}>There are no lambda functions.</p>
        ) : null}
    </div>
  )
}

export default LambdasPage


const LambdaModal = ({
    showLambdaModal,
    closeLambdaModal,
    code,
    setCode,
    lambdaName,
    setLambdaName,
    lambdaId,
    setLambdaId
}) => {

    const [showAlert, setShowAlert] = useState(false);

    const createLambda = async () => {
        try {
            const response = await fetch('http://localhost:8000/create_lambda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({code, lambda_name: lambdaName})
            });
            return response
        } catch (error) {
            return error
        }
    }

    const updateLambda = async (lambdaId) => {
        try {
            const response = await fetch(`http://localhost:8000/update_lambda/${lambdaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({code, lambda_name: lambdaName})
            });
            return response
        } catch (error) {
            return error
        }
    }

    const onDeploy = async () => {
        if (!lambdaName) {
            alert('Lambda name is required');
            return
        }
        // If lambda id is avaliable, then update, else create
        if (lambdaId) {
            const response = await updateLambda(lambdaId);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                alert('Lambda updated successfully');
                closeLambdaModal();
            }
        }
        else {
            const response = await createLambda();
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                alert('Lambda created successfully');
                closeLambdaModal();
            }

        }
    }

    const onLambdaNameChange = (e) => {
        const value = e.target.value;
    
        // Check if the value contains any invalid characters
        if (/[ ,\\']/g.test(value)) {
          setShowAlert(true); // Show the alert if there's an invalid character
        } else {
          setShowAlert(false); // Hide the alert if the input is valid
          //setLambdaName(value); // Update lambdaName only if valid
        }
        setLambdaName(value);
    };
  return (
    <Modal 
        show={showLambdaModal} 
        onHide={closeLambdaModal}
        size="xl"
        centered
    >
      <Modal.Header closeButton>
        {lambdaId ? 
            <Modal.Title>Lambda Function</Modal.Title> 
            : <Modal.Title>Create Lambda</Modal.Title>
        }
      </Modal.Header>
      <Modal.Body>
        {canDeployContainers ?  (<div style={{marginBottom: '30px'}}>
              <Row>
                  <Col style={{display: 'flex', justifyContent: 'flex-start'}}>
                      <Form style={{width: '100%', marginBottom: '0px'}}>
                      <Form.Group className='form-group' controlId="formBasicEmail" style={{marginBottom: '0px'}}>
                          <Form.Control 
                              type="text" 
                              placeholder="Enter Lambda Name"
                              value={lambdaName}
                              onBlur={(e) => setLambdaName(e.target.value)}
                              onChange={onLambdaNameChange}
                          />
                      </Form.Group>
                      {/* Conditionally render the CustomAlert if there's an invalid character */}
                      {showAlert && (
                          <CustomAlert
                          alertText="Lambda name cannot contain spaces, commas, backslashes, or single quotes."
                          level="danger"
                          dismissible={false}
                          />
                      )}
                      </Form>
                  </Col>
                  <Col style={{display: 'flex', justifyContent: 'flex-end', height: '100%'}}>
                      {lambdaId ? 
                          <Button variant="primary" onClick={onDeploy}>Re-Deploy</Button> :
                          <Button variant="primary" onClick={onDeploy}>Deploy</Button>
                      }
                  </Col>
              </Row>
          </div>): (
            <div style={{marginBottom: '30px'}}>
                <CustomAlert 
                alertText="Launching lambdas require deploying Docker containers, and based on your current configuration, this feature is not available." 
                level="danger" 
                dismissible={false} 
                />
            </div>)}
        <CodeEditor code={code} setCode={setCode}/>
      </Modal.Body>
    </Modal>
  )
}