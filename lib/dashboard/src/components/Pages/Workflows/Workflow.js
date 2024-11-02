import React, { useCallback, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  removeElements
} from '@xyflow/react';
import './Workflow.css';
import '@xyflow/react/dist/style.css';
import { Formik , Field, Form as FormikForm} from 'formik';
import { useNavigate } from "react-router-dom";
import NodeSidebar from '../../BlockConfigBar/NodeSidebar';
import AddBlockSidebar from '../../BlockConfigBar/AddBlockSidebar';

import nodeTypes from '../../Block/BlockTypes';

// Component Initial Data Imports
import { initialDataProcessBlock } from '../../Block/initialDataProcessBlock';

// Utility function imports
import { processNodeDataForBackend } from './Utils/ProcessDataForBackend';
import { FetchTaskRegistry } from './Utils/FetchTaskRegistry';
import { 
  checkCollision, 
  calculatePushPosition, 
  animateNodePosition 
} from './Utils/BlockRepositioning';

import { useAuth } from '../../../contexts/AuthContext';
import { CiEdit } from "react-icons/ci";

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

// Initial block configurations
let initialNodes = [
  { id: '1', type: 'input', position: { x: 300, y: 150 }, data: { label: 'Input Block', input_type: 'text' }, ...nodeDefaults, deletable:false },
  { id: '2', type: 'placeholderBlock', position: { x: 520, y: 135 }, data: { label: 'placeholder' }, ...nodeDefaults },
  { id: '3', type: 'output', position: { x: 700, y: 150 }, data: { label: 'Output Block' }, ...nodeDefaults, deletable:false },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function Flow() {

  const { token } = useAuth();

  const navigate = useNavigate();
  // Reactflow based workflow
  const [workflowCreateLoading, setWorkflowCreateLoading] = useState(false);
  const [workflowName, setWorkflowName] = useState('Click here to edit');
  const [workflowMetadataShow, setWorkflowMetadataShow] = useState(false);
  const [workflowMetadata, setWorkflowMetadata] = useState({
    name: '',
    description: ''
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [placeholderBlockExists, setPlaceholderBlockExists] = useState(true);

  // Node Config Side Bar
  const [nodeConfigSideBarShow, setNodeConfigSideBarShow] = useState(false);
  const [nodeConfigSideBarData, setNodeConfigSideBarData] = useState(null);
  const handleNodeConfigSideBarClose = () => setNodeConfigSideBarShow(false);
  const handleNodeConfigSideBarShow = () => setNodeConfigSideBarShow(true);

  // Add Node Side Bar
  const [addNodeSideBarShow, setAddNodeSideBarShow] = useState(false);
  const [addNodeSideBarData, setAddNodeSideBarData] = useState(null);
  const handleAddNodeSideBarClose = () => setAddNodeSideBarShow(false);
  const handleAddNodeSideBarShow = () => setAddNodeSideBarShow(true);

  const handleWorkflowMetadataShow = () => setWorkflowMetadataShow(true);
  const handleWorkflowMetadataClose = () => setWorkflowMetadataShow(false);

  useEffect(() => {
    setWorkflowMetadataShow(true);
  }, []);

  const handleNodeClick = (event, node) => {
    if (node.type === 'placeholderBlock') {
      return
    }
    handleNodeConfigSideBarShow();
    setNodeConfigSideBarData(node);
  };
  

  // General function to update node data fields due to changes added via NodeConfigBar
    const handleDataChange = (key, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeConfigSideBarData.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,  // Dynamically update the key
            },
          };
        }
        return node;
      })
    );
    setNodeConfigSideBarData((prev) => ({ ...prev, data: { ...prev.data, [key]: value } }));
  };

  const onConnect = (params) => {
    setEdges((eds) =>
      addEdge({ ...params, animated: true }, eds)
    );
  };


  const addNodeButtonClick = async () => {
    const blockTypes = await FetchTaskRegistry()
    if (blockTypes) {
      setAddNodeSideBarData(blockTypes)
      handleAddNodeSideBarShow()
    }
  };

  const handleSelectNode = (core_block_type) => {
    // TODO: This button will be interfaced thru a dropdown selection, that will determine
    // type of node spun up.
    setNodes((nds) => [
      ...nds,
      initialDataProcessBlock({nodeType:'process', 'core_block_type': core_block_type}),
    ]);
    if (placeholderBlockExists) {
      //remove placeholder block
      setNodes((nds) => nds.filter((node) => node.id !== '2'))
      setPlaceholderBlockExists(false)
    }
    handleAddNodeSideBarClose();
  }

  const handleRunWorkflowButton = () => {
    setWorkflowCreateLoading(true);
    // TODO: handle logic to prevent run workflow with placeholder block present or no edges flowing from input to output.
    let result = {}
    result['frontend_template'] = {
      nodes: nodes,
      edges: edges
    }
    const backend_template = processNodeDataForBackend(nodes, edges);

    result['backend_template'] = backend_template
    result['workflow_name'] = workflowMetadata.name
    result['workflow_description'] = workflowMetadata.description
    // Output the result as needed
    //console.log(result);

    fetch('http://localhost:8000/create_workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(result),
    })
      .then((response) => response.json())
      .then((data) => {
        const templateId = data.template_id
        const deploymentUrl = data.deployment_url
        navigate(`run/${templateId}`, {state: {deployment_url: deploymentUrl}})
      })
      .catch((error) => {
        console.error('Error:', error);
        setWorkflowCreateLoading(false);
      });

  };

  const handleNodeDragStop = useCallback((event, node) => {
    // Function to make sure blocks don't overlap by repositioning itself
    nodes.forEach((otherNode) => {
      if (node.id !== otherNode.id && checkCollision(node.position, otherNode.position)) {
        const targetPosition = calculatePushPosition(node.position, otherNode.position);
        animateNodePosition(otherNode, targetPosition, setNodes);
      }
    });
  }, [nodes]);


  return (
    <div>

      { workflowCreateLoading? 
          <p style={{height:'100vh'}}>Loading...</p> 
          : (
          <div style={{ height: '100vh' }}>
            <WorkflowMetadataComponent 
              show={workflowMetadataShow} 
              handleClose={handleWorkflowMetadataClose} 
              metadata={workflowMetadata}
              setMetadata={setWorkflowMetadata}
              setWorkflowName={setWorkflowName}
            />
            <Container fluid>
              <Row>
                <Col>
                  <div>
                    <p style={{fontWeight: '500', fontSize: '15px'}}>Configure Workflow</p>
                  </div>
                  <div style={{display: 'flex'}}>
                    <p style={{fontWeight: '500', fontSize: '20px'}}>{workflowName}</p>
                    <CiEdit 
                      size={24} 
                      className='workflow-button' 
                      onClick={handleWorkflowMetadataShow} 
                      style={{marginLeft: '10px'}}
                      />
                  </div>
                </Col>
                <Col className='workflow-button-container'>
                  <Button onClick={addNodeButtonClick}>Add Block</Button>
                  <Button onClick={handleRunWorkflowButton}>Create Workflow</Button>
                </Col>
              </Row>
            </Container>
            <div style={{ width: '100%', height: '80vh' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                onNodeClick={handleNodeClick}
                onNodeDragStop={handleNodeDragStop}
              >
                {nodeConfigSideBarData && (
                  <NodeSidebar
                    show={nodeConfigSideBarShow}
                    handleClose={handleNodeConfigSideBarClose}
                    sideBarData={nodeConfigSideBarData}
                    onDataChange={handleDataChange}
                  />
                )}

                <AddBlockSidebar
                  show={addNodeSideBarShow}
                  handleClose={handleAddNodeSideBarClose}
                  sideBarData={addNodeSideBarData}
                  handleSelectNode={handleSelectNode}
                />
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={10} size={0.8} />
              </ReactFlow>
            </div>
        </div>
      ) }


    </div>
      );
}

const WorkflowMetadataComponent = ({ show, handleClose, metadata, setMetadata, setWorkflowName }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Workflow</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: metadata.name, description: metadata.description }}
          onSubmit={(values) => {
            // Update metadata in the parent component
            setMetadata(values);
            setWorkflowName(values.name);
            handleClose(); // Close the modal after submitting
          }}
        >
          {({ handleSubmit }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Field name="name" className="form-control" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Field name="description" as="textarea" className="form-control" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};