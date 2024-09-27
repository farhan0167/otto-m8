import React from 'react';
import {Offcanvas, Form } from 'react-bootstrap';
import CustomAlert from '../Extras/CustomAlert';

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
          <Offcanvas.Title>Configure Block</Offcanvas.Title>
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

                {/* Modify resource type */}
                {sideBarData.data.modelCard && (
                    <Form.Group controlId="formResourceType">
                      <Form.Label>Model Card</Form.Label>
                      <Form.Control
                        type="text"
                        value={sideBarData.data.modelCard || ''}
                        onChange={(e) => onDataChange('modelCard', e.target.value)}
                      />
                      <CustomAlert 
                          alertText="Make sure to configure your Input Block input type properly for this model card."
                          level="warning"
                      />
                    </Form.Group>
                )}

                {/* Modify resource type */}
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
              </Form>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NodeSidebar;
