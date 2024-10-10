import React from 'react';
import {Offcanvas, Form } from 'react-bootstrap';
import CustomAlert from '../Extras/CustomAlert';
import HuggingFaceModelCarSideBarData from '../Block/HuggingFace/ModelCard/sideBarData';
import OllamaServerGenerateSideBarData from '../Block/Ollama/Generate/sideBarData';
import OllamaServerChatSideBarData from '../Block/Ollama/Chat/sideBarData';
import HTTPPostSideBarData from '../Block/HTTP/POST/sideBarData';

const NodeSidebar = ({ show, handleClose, sideBarData, onDataChange }) => {
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
          <h4 style={{fontWeight: '800'}}>Configure Block</h4>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Sidebar content */}
          {sideBarData && (
            <div>
              <Form>
              <Form.Text>Block Type: {sideBarData.type}</Form.Text>
              <hr/>
                <Form.Group controlId="formNodeLabel">
                  <Form.Label>Block Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={sideBarData.data.label}
                    onChange={(e) => onDataChange('label', e.target.value)}
                  />
                </Form.Group>

                {/* TODO Only displays for Input Blocks, probably to refactor away later. */}
                {sideBarData.data.input_type && (
                    <Form.Group controlId="formResourceType">
                      <Form.Label>Input Type</Form.Label>
                      <Form.Select value={sideBarData.data.input_type} onChange={(e) => onDataChange('input_type', e.target.value)}>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                      </Form.Select>
                      <CustomAlert 
                          alertText="Make sure you know the kind of input your models are expecting."
                          level="warning"
                      />
                    </Form.Group>
                )}

                {/* Hugging Face Model Card Block Config */}
                {sideBarData.data.core_block_type === "hugging_face_model_card" && (
                    <HuggingFaceModelCarSideBarData sideBarData={sideBarData} onDataChange={onDataChange} />
                )}

                {/* Ollama Server Generate Block Config */}
                {sideBarData.data.core_block_type === "ollama_server_generate" && (
                    <OllamaServerGenerateSideBarData sideBarData={sideBarData} onDataChange={onDataChange} />
                )}

                {/* Ollama Server Generate Block Config */}
                {sideBarData.data.core_block_type === "ollama_server_chat" && (
                    <OllamaServerChatSideBarData sideBarData={sideBarData} onDataChange={onDataChange} />
                )}

                {/* Integration Blocks go here */}
                {sideBarData.data.core_block_type === "http_post_request" && (
                    <HTTPPostSideBarData 
                      sideBarData={sideBarData} 
                      onDataChange={onDataChange} 
                    />
                )} 

              </Form>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeSidebar;
