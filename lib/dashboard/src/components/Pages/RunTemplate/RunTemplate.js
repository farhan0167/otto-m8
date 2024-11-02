import {React, useState, useEffect} from 'react'
import { useParams, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Image} from 'react-bootstrap';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
  } from '@xyflow/react';
  import nodeTypes from '../../Block/BlockTypes';
import { useAuth } from '../../../contexts/AuthContext';

const RunTemplate = () => {
    const params = useParams();
    const template_id = params.id;
    const { token, logout } = useAuth();

    const initialNodes = [
        { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 0 }, draggable: false },
        { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, draggable: false },
        // Add more nodes as needed
      ];
      
      const initialEdges = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      ];

    const location = useLocation();
    //const [deploymentUrl, setDeploymentUrl] = useState(location.state?.deployment_url || null);
    const [inputType, setInputType] = useState('text');
    const [deploymentUrl, setDeploymentUrl] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [blockData, setBlockData] = useState({});
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(!deploymentUrl); // Set loading to true if no url is available
    const [error, setError] = useState(null);
    
    const [inputText, setInputText] = useState('');
    const [response, setResponse] = useState(null);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);


  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let requestBody = {};
    // Determine whether fetch header and body should be application/json or file upload
    if (inputType === 'text') {
        requestBody = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ text: inputText }),
        };
    } else if (inputType === 'image') {
        if (!file) {
            alert('Please select an image to upload');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        // handle file upload here
        requestBody = {
          method: 'POST',
          body: formData,
        };
    }
    else {
        alert('Invalid input type');
        return;
    }

    fetch(deploymentUrl, requestBody)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setResponse(data);
        setBlockData(data)
        //setInputText(''); // Clear the input field
        setError(null); // Clear previous errors
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setResponse(null); // Clear previous response
        setLoading(false);
      });
  };

  // Handle file input changes
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setUploadSuccess(null); // Reset upload status
    }
  };

    useEffect(() => {
        
        // If url is not available, fetch it from the backend using the id
        if (!deploymentUrl) {
          setLoading(true);
          fetch(`http://localhost:8000/templates/${template_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${token}` 
            },
          })
            .then(response => {
              if (!response.ok) {
                if (response.status === 401) {
                  logout();
                }
                throw new Error('Failed to fetch URL');
              }
              return response.json();
            })
            .then(data => {
                setDeploymentUrl(data.deployment_url); // Set the fetched URL
                setNodes(data.frontend_template.nodes);
                setEdges(data.frontend_template.edges);
                // TODO Gotta make it more dynamic so we can have multiple inputs and multiple types.
                setInputType(data.frontend_template.nodes[0].data.input_type);
              setLoading(false);
            })
            .catch(err => {
              setError(err.message);
              setLoading(false);
            });
        }
      }, [template_id, deploymentUrl]);
      
      useEffect(() => {
        // Fit view on nodes and edges change
        if (reactFlowInstance) {
          reactFlowInstance.fitView();
        }
      }, [nodes, edges]);
      
  return (
    <Container>
        <div style={{ height: '500px' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                nodesDraggable={false} // Disable dragging for all nodes
                zoomOnScroll={false}
                fitView
                fitViewOptions={{ padding: 0.1 }}
                onInit={(instance) => setReactFlowInstance(instance)}
            >
                <MiniMap />
                <Controls showInteractive={false} showZoom={false}/>
                <Background variant="dots" gap={10} size={1} />
            </ReactFlow>
        </div>

        {loading != true? (<Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Input</Card.Title>
                        <Form>
                            <Form.Select value={inputType} onChange={(e) => setInputType(e.target.value)} disabled>
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                            </Form.Select>
                        </Form>
                        {/* Depending on the input type, show different input fields */}
                        {inputType === 'text' ? (
                              <Form onSubmit={handleSubmit}>
                              <Form.Group className='form-group' controlId="textInput">
                              <Form.Label>Type your text here:</Form.Label>
                              <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={inputText}
                                  onChange={handleChange}
                                  placeholder="Enter text..."
                                  required
                              />
                              </Form.Group>
                              <Button variant="primary" type="submit">
                              Run Workflow
                              </Button>
                          </Form>
                        ) : null}
                        {inputType === 'image' ? (
                          //Use bootstrap Form to upload an image
                          <Form onSubmit={handleSubmit}>
                              <Form.Group className='form-group' controlId="formFile">
                                <Form.Label>Select an image file to upload</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                              </Form.Group>

                              {previewUrl && (
                                <div className="mb-3">
                                  <h5>Image Preview:</h5>
                                  <Image src={previewUrl} thumbnail width="300" />
                                </div>
                              )}
                              <Button variant="primary" onClick={handleSubmit}>Upload Image</Button>
                          </Form>
                        ) : null}
                        
                    </Card.Body>
                </Card>
            </Col>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>Output</Card.Title>
                        {blockData.message? <JsonView data={JSON.parse(blockData.message)} shouldExpandNode={allExpanded} style={defaultStyles} />: null}
                    </Card.Body>
                </Card>
            </Col>
        </Row>): <p style={{height:'100vh'}}>Loading...</p>}
    </Container>
  )
}

export default RunTemplate