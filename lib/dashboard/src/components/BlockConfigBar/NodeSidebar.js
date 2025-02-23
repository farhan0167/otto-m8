import React, { useEffect, useState } from 'react';
import {Offcanvas, Form, Modal } from 'react-bootstrap';

import { AiOutlineCode } from "react-icons/ai";
import { Tooltip, IconButton, Divider } from '@mui/material';
import { BlockCode } from './Code';

import { BlockField } from '../FormFields/Fields';

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
                <div>
                  <Tooltip title="View Code">
                    <IconButton sx={{borderRadius: 0, padding: 0}} onClick={handleShow}>
                      <AiOutlineCode size={30} className='template-action' color='#00bb77'/>
                    </IconButton> 
                  </Tooltip>
                  <BlockCode blockDataConfig={blockDataConfig} onDataChange={onDataChange} show={show} handleClose={handleClose} />
                </div>
              )}
              <Divider />
              <Form style={{marginTop: '10px'}}>

                {blockDataConfig.sidebar_fields && blockDataConfig.sidebar_fields.map((field, index) => (
                    <BlockField 
                      key={index} 
                      field={field} 
                      blockData={blockDataConfig} 
                      connectedSourceNodes={connectedSourceNodes}
                      onDataChange={onDataChange}
                    />
                ))}
              </Form>
            </div>
          )}
    </div>
  )
}