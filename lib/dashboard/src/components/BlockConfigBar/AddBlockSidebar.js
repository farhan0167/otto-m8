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
            <AddBlockComponent blocksData={sideBarData} handleSelectNode={handleSelectNode}/>
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AddBlockSidebar;


export const AddBlockComponent = ({blocksData, handleSelectNode}) => {
    return (
      Object.entries(blocksData).map(([vendorName, Blocks]) => (
        <div key={vendorName} style={{marginBottom: '40px'}}>
          <p style={{fontWeight: '500'}}>{vendorName}</p>
          <ListGroup style={{maxHeight: '120px', overflowY: 'auto'}}>
            {Object.entries(Blocks).map(([blockName, core_block_type]) => (
                <ListGroup.Item key={core_block_type}  onClick={() => handleSelectNode(core_block_type)}>{blockName}</ListGroup.Item>       
            ))}
          </ListGroup>
        </div>
      ))
    )
}