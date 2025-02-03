import React from 'react';
import { Button, Offcanvas, CardText, Form, ListGroup } from 'react-bootstrap';

// TODO: Move this to a separate file
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

const get_block_code = async (core_block_type, process_type) => {
  try {
      const response = await fetch(`http://localhost:8000/get_block_codes?core_block_type=${core_block_type}&process_type=${process_type}`);
      const data = await response.json();
      return data
  } catch (error) {
      console.error('Error fetching block codes:', error);
      return [];
  }
};


export const AddBlockComponent = ({blocksData, handleSelectNode}) => {
  const handleOnNodeSelect = async (blockMetadata) => {
    const core_block_type = blockMetadata.core_block_type
    const process_type = blockMetadata.process_type
    const block_code = await get_block_code(core_block_type, process_type)
    handleSelectNode(blockMetadata, block_code)
  }
    return (
      Object.entries(blocksData).map(([vendorName, Blocks]) => (
        <div key={vendorName} style={{marginBottom: '40px'}}>
          <p style={{fontWeight: '500'}}>{vendorName}</p>
          <ListGroup style={{maxHeight: '120px', overflowY: 'auto'}}>
            {Object.entries(Blocks).map(([blockName, blockMetadata], index) => (
                <ListGroup.Item key={index}  onClick={() => handleOnNodeSelect(blockMetadata)}>{blockName}</ListGroup.Item>       
            ))}
          </ListGroup>
        </div>
      ))
    )
}