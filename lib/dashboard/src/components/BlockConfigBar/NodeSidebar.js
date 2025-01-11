import React, { useEffect, useState } from 'react';
import {Offcanvas, Form, Modal } from 'react-bootstrap';
import CustomAlert from '../Extras/CustomAlert';
import HuggingFaceModelCarSideBarData from '../Block/HuggingFace/ModelCard/sideBarData';
import OllamaServerGenerateSideBarData from '../Block/Ollama/Generate/sideBarData';
import OllamaServerChatSideBarData from '../Block/Ollama/Chat/sideBarData';
import HTTPPostSideBarData from '../Block/HTTP/POST/sideBarData';
import OpenAIChatSideBarData from '../Block/OpenAI/Chat/sideBarData';
import LambdaFunctionSideBarData from '../Block/Lambda/sideBarData';
import HuggingFaceMultimodalSideBarData from '../Block/HuggingFace/MultimodalPipeline/sideBarData';

import { AiOutlineCode } from "react-icons/ai";
import { Tooltip, IconButton, Divider } from '@mui/material';
import { CodeEditor } from '../Pages/Lambdas/CodeEditor';

// TODO: Move this to a separate file
const NodeSidebar = ({ show, handleClose, sideBarData, onDataChange }) => {
  const [blockDataConfig, setBlockDataConfig] = useState(null);
  const [connectedSourceNodes, setConnectedSourceNodes] = useState([]);

  useEffect(() => {
    setBlockDataConfig(sideBarData.data);
    setConnectedSourceNodes(sideBarData.connectedSourceNodes);
  }, [sideBarData]);

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop={false}
        scroll={true}
        enforceFocus={false}
      >
        <Offcanvas.Header closeButton>
          <h4 style={{fontWeight: '800'}}>Block Config</h4>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Sidebar content */}
          <NodeConfigurationComponent 
            blockDataConfig={blockDataConfig}
            connectedSourceNodes={connectedSourceNodes} 
            onDataChange={onDataChange}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeSidebar;


export const NodeConfigurationComponent = ({
  blockDataConfig,
  connectedSourceNodes, 
  onDataChange
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
        
        {blockDataConfig && (
            
            <div>
              <p style={{fontSize: '12px', marginTop: '10px'}}>id: {blockDataConfig.label}</p>
              <Divider />
              {blockDataConfig.source_code && (
                  <Tooltip title="View Code">
                  <IconButton sx={{borderRadius: 0, padding: 0}} onClick={handleShow}>
                    <AiOutlineCode size={30} className='template-action' color='#00bb77'/>
                  </IconButton> 
                </Tooltip>
              )}
                <CodeModal blockDataConfig={blockDataConfig} show={show} handleClose={handleClose} />
                <Divider />
              <Form style={{marginTop: '10px'}}>
                
                {blockDataConfig.label && (
                  <Form.Group className='form-group' controlId="formNodeLabel">
                    <Form.Label>Block Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={blockDataConfig.custom_name}
                      onChange={(e) => onDataChange('custom_name', e.target.value)}
                    />
                  </Form.Group>
                )}
                
                {/* TODO Only displays for Input Blocks, probably to refactor away later. */}
                {blockDataConfig.input_type && (
                    <Form.Group className='form-group' controlId="formResourceType">
                      <Form.Label>Input Type</Form.Label>
                      <Form.Select value={blockDataConfig.input_type} onChange={(e) => onDataChange('input_type', e.target.value)}>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="file">File Upload</option>
                      </Form.Select>
                      <CustomAlert 
                          alertText="Make sure you know the kind of input your models are expecting."
                          level="warning"
                      />
                    </Form.Group>
                )}

                {/* Hugging Face Model Card Block Config */}
                {blockDataConfig.core_block_type === "hugging_face_model_card" && (
                    <HuggingFaceModelCarSideBarData sideBarData={blockDataConfig} onDataChange={onDataChange} />
                )}

                {/* Hugging Face Multimodal Block Config */}
                {blockDataConfig.core_block_type === "hugging_face_multimodal" && (
                    <HuggingFaceMultimodalSideBarData 
                    sideBarData={blockDataConfig} 
                    onDataChange={onDataChange} 
                    connectedSourceNodes={connectedSourceNodes}
                    />
                )}

                {/* Ollama Server Generate Block Config */}
                {blockDataConfig.core_block_type === "ollama_server_generate" && (
                    <OllamaServerGenerateSideBarData 
                      sideBarData={blockDataConfig} 
                      onDataChange={onDataChange} 
                      connectedSourceNodes={connectedSourceNodes}
                      />
                )}

                {/* Ollama Server Generate Block Config */}
                {blockDataConfig.core_block_type === "ollama_server_chat" && (
                    <OllamaServerChatSideBarData 
                      sideBarData={blockDataConfig} 
                      onDataChange={onDataChange} 
                      connectedSourceNodes={connectedSourceNodes}
                    />
                )}
                {/* OpenAI Chat Block Config */}
                {blockDataConfig.core_block_type === "openai_chat" && (
                    <OpenAIChatSideBarData 
                      sideBarData={blockDataConfig} 
                      connectedSourceNodes={connectedSourceNodes} 
                      onDataChange={onDataChange} 
                    />
                )}

                {/* Integration Blocks go here */}
                {blockDataConfig.core_block_type === "http_post_request" && (
                    <HTTPPostSideBarData 
                      sideBarData={blockDataConfig} 
                      onDataChange={onDataChange} 
                    />
                )}
                {blockDataConfig.core_block_type === "lambda_function" && (
                    <LambdaFunctionSideBarData 
                      sideBarData={blockDataConfig} 
                      onDataChange={onDataChange} 
                    />
                )} 

              </Form>
            </div>
          )}
    </div>
  )
}

const CodeModal = ({blockDataConfig, show, handleClose}) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Source Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CodeEditor
          code={blockDataConfig.source_code}
        />
      </Modal.Body>
    </Modal>
  )
}