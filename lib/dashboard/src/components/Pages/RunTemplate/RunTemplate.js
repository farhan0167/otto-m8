import {React, useState, useEffect} from 'react'
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import NodeSidebar from '../../BlockConfigBar/NodeSidebar';
import TopErrorBar from '../../Extras/TopErrorBar';
import { UploadFile, UploadFileNames } from '../../InputHandles/UploadFile';
import { createInputPayload } from '../../InputHandles/createInputPayload';
import { prepareInputBlock } from '../../InputHandles/utils';
import TextInput from '../../InputHandles/TextInput';
import { useLoadingStateHook } from '../../../hooks/use_loading';
import { useInputHandlerHooks, useUploadFileNameHooks } from '../../../hooks/input_handlers';
import { checkHealth } from '../../../utils/health_check';
import Run from '../../RunTemplate/Run';

const RunTemplate = () => {
    const params = useParams();
    const template_id = params.id;
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const initialNodes = [
        { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 0 }, draggable: false },
        { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, draggable: false },
        // Add more nodes as needed
      ];
      
      const initialEdges = [
        { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      ];

    const [deploymentUrl, setDeploymentUrl] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [blockData, setBlockData] = useState({});
    const [disabled, setDisabled] = useState(true);
    const {loading, setLoading} = useLoadingStateHook();
    const [error, setError] = useState(null);
    const [showTopErrorBar, setShowTopErrorBar] = useState(false)

    const {
        inputTextBlocks, setInputTextBlocks,
        inputUploadBlocks, setInputUploadBlocks,
        inputURLBlocks, setInputURLBlocks,
        inputData, setInputData
    } = useInputHandlerHooks();

    const {
        uploadFileNames, 
        setUploadFileName,
    } = useUploadFileNameHooks();

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [nodeConfigSideBarShow, setNodeConfigSideBarShow] = useState(false);
    const [nodeConfigSideBarData, setNodeConfigSideBarData] = useState(null);
    const handleNodeConfigSideBarClose = () => setNodeConfigSideBarShow(false);
    const handleNodeConfigSideBarShow = () => setNodeConfigSideBarShow(true);

    const [showChatButton, setShowChatButton] = useState(false);

    const handleChatButtonClick = () => {
      // Handle chat button click here
      navigate(`/chat/${template_id}`)
    };

    const handleDataChange = (key, value) => {
      //do nothing since this is a read only component
    }

    const handleNodeClick = (event, node) => {
      if (node.type === 'placeholderBlock') {
        return
      }
      handleNodeConfigSideBarShow();
      setNodeConfigSideBarData(node);
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading({loading: true, message: 'Loading...'});
    let requestBody = {};
    requestBody = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        template_id: template_id,
        data: inputData
      }),
    };
    //return

    fetch(deploymentUrl, requestBody)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setBlockData(data)
        setError(null); // Clear previous errors
        setLoading({loading: false, message: ''});
      })
      .catch((err) => {
        setError(err.message);
        setLoading({loading: false, message: ''});
        setShowTopErrorBar(true)
      });
  };

    useEffect(() => {
        
        // If url is not available, fetch it from the backend using the id
        if (!deploymentUrl) {
          setLoading({loading: true, message: 'Loading Workflow...'});
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

                // Check if chat output is present, then show the chat button
                const backendTemplate = data.backend_template;
                const chatOutput = backendTemplate['output'].find(item => item.name === 'Chat_Output');
                if (chatOutput) {
                  setShowChatButton(true);
                }

                const { user_input, uploads, urls } = prepareInputBlock(backendTemplate['input'])
                setInputTextBlocks(user_input)
                setInputUploadBlocks(uploads)
                setInputURLBlocks(urls)

                const inputPayload = createInputPayload(backendTemplate['input'])
                setInputData((prev) => ({ ...prev, ...inputPayload }));
                setLoading({loading: false, message: ''});
                checkHealth(data.deployment_url, setLoading);
            })
            .catch(err => {
              setError(err.message);
              setLoading({loading: false, message: ''});
              setShowTopErrorBar(true)
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
    <>
    <TopErrorBar
          errorMessage={error}
          topErrorBarShow={showTopErrorBar}
          setTopErrorBarShow={setShowTopErrorBar}
    />
    <Container fluid>
        <Row>
        <Col xs={12} sm={12} lg={12} xl={12}>
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
                onNodeClick={handleNodeClick}
            >
                <MiniMap />
                <Controls showInteractive={false} showZoom={false}/>
                <Background variant="dots" gap={10} size={1} />
            </ReactFlow>
            {nodeConfigSideBarData && (
                  <NodeSidebar
                    show={nodeConfigSideBarShow}
                    handleClose={handleNodeConfigSideBarClose}
                    sideBarData={nodeConfigSideBarData}
                    onDataChange={handleDataChange}
                  />
                )}
        </div>
        </Col>
        </Row>

        {loading.loading != true? (
            <Run
                blockData={blockData}
                showChatButton={showChatButton}
                handleChatButtonClick={handleChatButtonClick}
                inputTextBlocks={inputTextBlocks}
                inputUploadBlocks={inputUploadBlocks}
                inputData={inputData}
                setInputData={setInputData}
                uploadFileNames={uploadFileNames}
                setUploadFileName={setUploadFileName}
                handleSubmit={handleSubmit}
            />
        ): <p style={{height:'100vh'}}>{loading.message}</p>}
    </Container>
    </>
  )
}

export default RunTemplate