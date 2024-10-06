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
        className="add-node-sidebar"
      >
        <Offcanvas.Header closeButton>
          <h4 style={{fontWeight: '800'}}>Add A Node</h4>
        </Offcanvas.Header>
        <Offcanvas.Body>

          {sideBarData && 
            Object.entries(sideBarData).map(([vendorName, Blocks]) => (
              <div key={vendorName} style={{marginBottom: '40px'}}>
                <p style={{fontWeight: '500'}}>{vendorName}</p>
                <ListGroup style={{maxHeight: '120px', overflowY: 'auto'}}>
                  {Object.entries(Blocks).map(([blockName, blockMetadata]) => (
                      <ListGroup.Item key={blockMetadata} action onClick={() => handleSelectNode(blockMetadata)}>{blockName}</ListGroup.Item>       
                  ))}
                </ListGroup>
                <hr/>
              </div>
            ))
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AddBlockSidebar;
