import React from 'react';
import { Button, Offcanvas, CardText, Form, ListGroup } from 'react-bootstrap';

const AddBlockSidebar = ({ show, handleClose, sideBarData, handleSelectNode }) => {
  
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
          <Offcanvas.Title>Add A Node</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

          {sideBarData && 
            Object.entries(sideBarData).map(([vendorName, Blocks]) => (
              <div key={vendorName}>
                <h5>{vendorName}</h5>
                <ListGroup style={{maxHeight: '120px', overflowY: 'auto'}}>
                  {Object.entries(Blocks).map(([blockName, blockMetadata]) => (
                      <ListGroup.Item key={blockMetadata} onClick={() => handleSelectNode(blockMetadata)}>{blockName}</ListGroup.Item>       
                  ))}
                </ListGroup>
              </div>
            ))
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AddBlockSidebar;
