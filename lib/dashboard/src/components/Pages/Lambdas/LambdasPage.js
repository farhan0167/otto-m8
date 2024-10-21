import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Form, Col, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { IoIosRefresh } from "react-icons/io";

import { CodeEditor } from './CodeEditor';

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
    <div style={{'height': '100vh'}}>
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
      <Table hover>

      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data? data.map((item) => (

              <tr key={item.id}>
                  <td>
                    
                  </td>
                  <td>
                    <p onClick={() => handleClickLambda(item)}>{item.name}</p>
                  </td>
                  <td className='table-row-actions'>
                    <FaTrash title='Delete Lambda' className='template-action' onClick={() => deleteLambda(item)}/>
                  </td>
                </tr>

        )): <p>Loading..</p>}
      </tbody>
      </Table>
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
        // If lambda id is avaliable, then update, else create
        if (lambdaId) {
            const response = await updateLambda(lambdaId);
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                alert('Lambda updated successfully');
                closeLambdaModal();
            }
        }
        else {
            const response = await createLambda();
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                alert('Lambda created successfully');
                closeLambdaModal();
            }

        }
    }

    const onLambdaNameChange = (e) => {
        setLambdaName(e.target.value);
    }
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
        <div style={{marginBottom: '30px'}}>
            <Row>
                <Col style={{display: 'flex', justifyContent: 'flex-start'}}>
                    <Form style={{width: '100%'}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Lambda Name"
                            value={lambdaName}
                            onBlur={(e) => setLambdaName(e.target.value)}
                            onChange={onLambdaNameChange}
                        />
                    </Form.Group>
                    </Form>
                </Col>
                <Col style={{display: 'flex', justifyContent: 'flex-end', height: '100%'}}>
                    {lambdaId ? 
                        <Button variant="primary" onClick={onDeploy}>Re-Deploy</Button> :
                        <Button variant="primary" onClick={onDeploy}>Deploy</Button>
                    }
                </Col>
            </Row>
        </div>
        <CodeEditor code={code} setCode={setCode}/>
      </Modal.Body>
    </Modal>
  )
}