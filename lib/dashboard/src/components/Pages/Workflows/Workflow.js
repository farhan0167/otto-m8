import React, { useCallback, useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { sha1 } from 'js-sha1';
import {Box, Button, ButtonGroup, Container, Stack} from '@mui/material'
import Grid from '@mui/material/Grid2';
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
import * as Yup from 'yup';
import '@xyflow/react/dist/style.css';
import { Formik , Field, Form as FormikForm} from 'formik';
import { useNavigate, useLocation } from "react-router-dom";
import NodeSidebar from '../../BlockConfigBar/NodeSidebar';
import AddBlockSidebar from '../../BlockConfigBar/AddBlockSidebar';

import nodeTypes from '../../Block/BlockTypes';

// Utility function imports
import { processNodeDataForBackend } from './Utils/ProcessDataForBackend';
import { fetch_task_registry, fetch_block_data } from '../../../api/blocks';
import { 
  checkCollision, 
  calculatePushPosition, 
  animateNodePosition 
} from '../../../utils/workflow/BlockRepositioning';

import CustomAlert from '../../Extras/CustomAlert';
import TopErrorBar from '../../Extras/TopErrorBar';

import { useAuth } from '../../../contexts/AuthContext';
import { CiEdit } from "react-icons/ci";

//Draft Workflow imports
import { LinearProgress } from '@mui/material';
import { Tooltip, IconButton } from '@mui/material';
import { TfiSave } from "react-icons/tfi";

//TestWorkflow imports
import TestWorkflow from './TestWorkflow';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const getInitialDataTextInput = async () => {
  const core_block_type = 'text_input';
  const process_type = 'task';
  let block_data = await fetch_block_data(core_block_type, process_type);
  block_data.id = '1';
  block_data.data.label = 'Input Block';
  block_data.data.core_block_type = core_block_type;
  return block_data
}

const getInitialDataOutput = async () => {
  const core_block_type = 'output';
  const process_type = 'task';
  let block_data = await fetch_block_data(core_block_type, process_type);
  block_data.id = '3';
  block_data.data.label = 'Output Block';
  block_data.data.core_block_type = core_block_type;
  return block_data
}

// Initial block configurations
let initialNodes = [
  await getInitialDataTextInput(),
  { id: '2', type: 'placeholderBlock', position: { x: 520, y: 135 }, data: { label: 'placeholder' }, ...nodeDefaults },
  await getInitialDataOutput(),
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const canDeployWorkflow = process.env.REACT_APP_CAN_DEPLOY_WORKFLOW;

export default function Flow() {

  const { token, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  // Reactflow based workflow
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
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

  // Error Bar
  const [topErrorBarShow, setTopErrorBarShow] = useState(false)
  const [workflowErrorMessage, setWorkflowErrorMessage] = useState('')

  // Draft related:
  const [draftTemplateId, setDraftTemplateId] = useState(null);
  const [draftSaveLoading, setDraftSaveLoading] = useState(false);
  const [ draftType, setDraftType ] = useState(null)
  const [ draftReferenceTemplateId, setDraftReferenceTemplateId ] = useState(null)

  // Test related:
  const [showTestWorkflow, setShowTestWorkflow] = useState(false)
  const [testWorkflowNodes, setTestWorkflowNodes] = useState([])
  const [testWorkflowEdges, setTestWorkflowEdges] = useState([])


  useEffect(() => {
    const draft_workflow = location.state

    setDraftType(draft_workflow.type)
    // If a new workflow is being created, create a record of the draft as a WIP
    if (['new', 'preset'].includes(draft_workflow.type)) {
          const createDraftWorkflow = async (template) => {
            try {
              const response = await fetch('http://localhost:8000/create_draft_workflow', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({
                    payload: template
                }),
              });
              if (response.ok) {
                const data = await response.json();
                setDraftSaveLoading(true)
                const template_new = {
                  ...template,
                  id: data.template_id
                }
                navigate('/workflow', { state: { type: 'draft', template: template_new }, replace: true })
                setDraftSaveLoading(false)
              }
              else {navigate('/')}
            } catch (error) {
              console.log(error)
              navigate('/')
            }
          }

          createDraftWorkflow(draft_workflow.template);
    }
    else if (draft_workflow.type === 'draft') {
        // Query draft table to get template id, then set nodes and everything
        setDraftTemplateId(draft_workflow.template.id)
    }

    setNodes(draft_workflow.template.nodes)
    setEdges(draft_workflow.template.edges)
    setWorkflowMetadata({
      name: draft_workflow.template.name,
      description: draft_workflow.template.description
    })
    setWorkflowName(draft_workflow.template.name)
    setDraftReferenceTemplateId(draft_workflow.template.reference_template_id)

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
    
  }, [location.state.type]);

  useEffect(() => {
    // Fit view when reactFlowInstance is ready
    if (reactFlowInstance) {
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance]);

  const handleNodeClick = (event, node) => {
    if (node.type === 'placeholderBlock') {
      return
    }
    // Find edges connected to this node
    const connectedEdges = edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id
    );

    // Get connected source and target nodes
    const connectedSourceNodes = connectedEdges
      .filter((edge) => edge.target === node.id)
      .map((edge) => nodes.find((n) => n.id === edge.source));
    
    const connectedTargetNodes = connectedEdges
      .filter((edge) => edge.source === node.id)
      .map((edge) => nodes.find((n) => n.id === edge.target));

    const updatedNode = {...node, connectedSourceNodes: connectedSourceNodes}
    handleNodeConfigSideBarShow();
    setNodeConfigSideBarData(updatedNode);
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
    // Find the source node from the nodes state
    const sourceNode = nodes.find((node) => node.id === params.source);
    
    // Find all source nodes connected to the target node
    const connectedSourceNodes = edges
    .filter((edge) => edge.target === params.target)
    .map((edge) => nodes.find((node) => node.id === edge.source))
    .filter(Boolean); // Filter out undefined nodes in case of errors

    // Add the newly connected source node if it's not already in the list
    if (!connectedSourceNodes.some((node) => node.id === params.source)) {
      connectedSourceNodes.push(sourceNode);
    }

    setEdges((eds) =>
      addEdge({ ...params, animated: true }, eds)
    );
    // Update the connectedSourceNodes in the nodeConfigSideBarData to pass variables
    setNodeConfigSideBarData((prev) => ({ ...prev, connectedSourceNodes: connectedSourceNodes }));
  };


  const addNodeButtonClick = async () => {
    const blockTypes = await fetch_task_registry()
    if (blockTypes) {
      setAddNodeSideBarData(blockTypes)
      handleAddNodeSideBarShow()
    }
  };

  const handleSelectNode =  async (blockMetadata, block_code) => {
    // TODO: This button will be interfaced thru a dropdown selection, that will determine
    // type of node spun up.
    const core_block_type = blockMetadata.core_block_type
    const reference_core_block_type = blockMetadata.reference_core_block_type
    const nodeType = blockMetadata.ui_block_type
    const process_type = blockMetadata.process_type

    let block_data = await fetch_block_data(core_block_type, process_type)

    block_data.id = Math.random().toString(36).substr(2, 5);

    // Hack: Enforce a max of one output block.
    if (core_block_type === 'output' || core_block_type === 'chat_output') {
        setNodes((nds) => {
          let outputNodeExists = false
          // Check if there's already an 'output' type node
          if (core_block_type === 'output'){
            block_data.data.label = 'Output Block'
            outputNodeExists = nds.some((node) => node.type === 'output');
          }
          if (core_block_type === 'chat_output'){
            block_data.data.label = 'Chat Output'
            outputNodeExists = nds.some((node) => node.data.label === 'Chat Output');
          }
      
          // If an output node exists, return the nodes as is without adding a new one
          if (outputNodeExists) {
            setWorkflowErrorMessage('Only one output block is allowed')
            setTopErrorBarShow(true)
            return nds;
          };
          block_data.type = nodeType;
          block_data.data.process_type = process_type;
          block_data.data.reference_core_block_type = reference_core_block_type
          block_data.data.core_block_type =  core_block_type;

          block_data = {
            ...block_data,
            ...nodeDefaults
          }
          // Otherwise, add the new output node
          return [
            ...nds,
            block_data
          ];
        });
    }
    else{
        // TODO: Refactor the block initialization process into utils directory.
        // For every block that's not an output block
        if (nodeType === 'input') {
          block_data.sourcePosition = Position.Right
        }
        if (core_block_type == 'image_input') {
          //Fix this before push
          block_data.data.label = 'Image Input';
        }
        else if (core_block_type == 'langchain_pdf_loader') {
          block_data.data.label = 'Langchain PDF Loader';
        }
        else {
          block_data.data.label = uuidv4();
        }
        block_data.type = nodeType;
        block_data.data.process_type = process_type;
        block_data.data.reference_core_block_type = reference_core_block_type
        block_data.data.core_block_type =  core_block_type; // probably legacy. reevaluate its purpose.
        block_data.data.source_code = block_code['source_code']
        block_data.data.source_hash = sha1(block_code['source_code'])
        block_data.data.source_path = block_code['source_path']
        setNodes((nds) => {
          return [
            ...nds,
            block_data
          ];
        });
    }
    if (placeholderBlockExists) {
      //remove placeholder block
      setNodes((nds) => nds.filter((node) => node.id !== '2'))
      setPlaceholderBlockExists(false)
    }
    // }
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
    console.log(result)
    
    // if workflow name is empty, prevent workflow creation
    if (workflowMetadata.name === '') {
        setWorkflowCreateLoading(false);
        setTopErrorBarShow(true)
        setWorkflowErrorMessage("Workflow name cannot be empty.")
        return
    }
    result['workflow_name'] = workflowMetadata.name
    result['workflow_description'] = workflowMetadata.description

    // if no reference draft template, then this is considered a new workflow.
    if (draftReferenceTemplateId === null) {
        result['draft_template_id'] = draftTemplateId
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
            navigate(`/run/${templateId}`, {state: {deployment_url: deploymentUrl}})
          })
          .catch((error) => {
            setWorkflowCreateLoading(false);
            setTopErrorBarShow(true)
            setWorkflowErrorMessage("Something went wrong creating the workflow. Check your logs.")
          });
    }
    // if reference draft template is present, then this is considered an update to an existing workflow
    else {
        result['reference_template_id'] = draftReferenceTemplateId
        fetch('http://localhost:8000/update_workflow', {
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
            navigate(`/run/${templateId}`, {state: {deployment_url: deploymentUrl}})
          })
          .catch((error) => {
            setWorkflowCreateLoading(false);
            setTopErrorBarShow(true)
            setWorkflowErrorMessage("Something went wrong creating the workflow. Check your logs.")
          });
    }

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

  // Draft related functions
  const handleDraftSave = () => {
      const updateDraftTemplate = async () => {
        const template = {
          name: workflowMetadata.name,
          description: workflowMetadata.description,
          nodes: nodes,
          edges: edges,
          reference_template_id: draftReferenceTemplateId
        };

        try {
          const response = await fetch(`http://localhost:8000/update_draft_workflow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              template_id: draftTemplateId,
              payload: template
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to update draft template');
          }
          const data = await response.json();
          setDraftSaveLoading(true)
          navigate('/workflow', { state: { type: 'draft', template: { id: data.template_id, ...template } }, replace: true })
          setTimeout(() => {
            setDraftSaveLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error updating draft template:', error);
        }
      };
      const createDraftWorkflow = async () => {
          try {
            const template = {
              name: workflowMetadata.name,
              description: workflowMetadata.description,
              nodes: nodes,
              edges: edges,
              reference_template_id: draftReferenceTemplateId
            };
            const response = await fetch('http://localhost:8000/create_draft_workflow', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({
                  payload: template
              }),
            });
            if (response.ok) {
              const data = await response.json();
              setDraftSaveLoading(true)
              const template_new = {
                ...template,
                id: data.template_id
              }
              navigate('/workflow', { state: { type: 'draft', template: template_new }, replace: true })
              setDraftSaveLoading(false)
            }
            else {navigate('/')}
          } catch (error) {
            console.log(error)
            navigate('/')
          }
      }
      if (draftType === 'edit' && draftTemplateId === null) {
        // Create a new draft template
        createDraftWorkflow();
        return
      }
      else if (draftType === 'draft'){
        updateDraftTemplate();
        return
      }
  }
  // Test workflow related functions
  const handleShowTestWorkflow = () => {
    setTestWorkflowNodes(nodes) 
    setTestWorkflowEdges(edges)
    setShowTestWorkflow(true)
  }
  const handleCloseTestWorkflow = () => {
    setShowTestWorkflow(false)
    setTestWorkflowNodes([])
    setTestWorkflowEdges([])
  }

  return (
    <div>
      <TopErrorBar
        errorMessage={workflowErrorMessage}
        topErrorBarShow={topErrorBarShow}
        setTopErrorBarShow={setTopErrorBarShow}
      />
      <LinearProgress sx={{ visibility: draftSaveLoading ? 'visible' : 'hidden', position: 'fixed', width: '100vw', top: 0, left: 0 }}/>

      { workflowCreateLoading? 
          <p style={{height:'100vh'}}>Loading...</p> 
          : (
          <Container sx={{ height: '100%' }} fluid maxWidth="xl">
            <WorkflowMetadataComponent 
              show={workflowMetadataShow} 
              handleClose={handleWorkflowMetadataClose} 
              metadata={workflowMetadata}
              setMetadata={setWorkflowMetadata}
              setWorkflowName={setWorkflowName}
            />
            <Grid container spacing={2} sx={{justifyContent: 'space-between'}}>
              <Grid item xs={3}>
                <Box>
                  <div>
                    <p style={{fontWeight: '500', fontSize: '15px'}}>Configure Workflow</p>
                  </div>
                  <div style={{display: 'flex'}}>
                    <p style={{fontWeight: '500', fontSize: '20px'}}>{workflowName}</p>
                    <CiEdit 
                      size={24} 
                      className='workflow-button' 
                      onClick={handleWorkflowMetadataShow} 
                      style={{marginLeft: '10px', cursor: 'pointer'}}
                      />
                  </div>
                </Box>
              </Grid>
              <Grid item xs={9}>
                <Box sx={{ display: 'flex', marginTop: '10px', marginBottom: '20px' }}>
                  <Stack variant="outlined" aria-label="Loading button group" direction="row" spacing={1} sx={{height: '40px'}}>
                      <Button id='add-block-button' color='primary' variant='contained' sx={{width: '120px'}} onClick={addNodeButtonClick} size='medium'>Add Block</Button>
                      <Button color='primary' variant='contained' sx={{width: '160px'}} onClick={handleShowTestWorkflow} size='medium'>Test Workflow</Button>
                      {canDeployWorkflow===true && <Button color='primary' variant='contained' sx={{width: '120px'}} onClick={handleRunWorkflowButton} size='medium'>Deploy</Button>}
                      <Tooltip title='Save Draft'>
                        <Button onClick={handleDraftSave} variant='outlined' sx={{minWidth: '40px', width: '45px', padding: '0px'}}>
                          <TfiSave size={20} className='template-action'/>
                        </Button> 
                      </Tooltip>
                  </Stack>

                  <TestWorkflow 
                    show={showTestWorkflow}
                    handleClose={handleCloseTestWorkflow}
                    nodes={testWorkflowNodes}
                    edges={testWorkflowEdges}
                  />
                </Box>
              </Grid>

            </Grid>
            <div style={{ width: '100%', height: '80vh' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.1 }}
                onInit={(instance) => setReactFlowInstance(instance)}
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
        </Container>
      ) }


    </div>
      );
}

const validationSchemaWorkflow = Yup.object().shape({
  name: Yup.string()
    .matches(/^[^,'\\\s]+$/, "Name cannot contain spaces, commas, backslashes, or single quotes.")
});

const WorkflowMetadataComponent = ({ show, handleClose, metadata, setMetadata, setWorkflowName }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Workflow</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: metadata.name, description: metadata.description }}
          validationSchema={validationSchemaWorkflow}
          onSubmit={(values) => {
            // Update metadata in the parent component
            setMetadata(values);
            setWorkflowName(values.name);
            handleClose(); // Close the modal after submitting
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Field name="name" className="form-control" />
              </Form.Group>
              {/* Show CustomAlert if there's an error on the name field */}
              {errors.name && touched.name && (
                <CustomAlert 
                  alertText={errors.name} 
                  level="danger"
                  dismissible={false}
                  />
              )}
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