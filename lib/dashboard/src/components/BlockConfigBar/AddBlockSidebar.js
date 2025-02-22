import React, { useState, useEffect } from 'react';
import { Button, Offcanvas, CardText, Form, ListGroup } from 'react-bootstrap';
import { Tooltip, IconButton, Button as MuiButton } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { get_block_code, delete_block } from '../../api/blocks';

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
          <h4 style={{fontWeight: '800'}}>Add A Block</h4>
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
  const [blockData, setBlockData] = useState(Object);

  useEffect(() => {
    setBlockData(blocksData)
  }, [blocksData])

  const handleOnNodeSelect = async (blockMetadata) => {
    const source_path = blockMetadata.source_path
    const block_code = await get_block_code(source_path)
    handleSelectNode(blockMetadata, block_code)
  }

  const onDeleteCustomBlock = async (blockMetadata, vendorName, blockName) => {
    delete_block(blockMetadata, vendorName, blockName)
    // remove the deleted block from the blockData state
    const newBlockData = {...blockData}
    delete newBlockData[vendorName][blockName]
    setBlockData(newBlockData)
  }
    return (
      Object.entries(blockData).map(([vendorName, Blocks]) => (
        <div key={vendorName} style={{marginBottom: '40px'}}>
          <p style={{fontWeight: '500'}}>{vendorName}</p>
          <ListGroup style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {Object.entries(Blocks).map(([blockName, blockMetadata], index) => (
                blockMetadata.process_type === 'custom' ? (
                  <ListGroup.Item key={`${index}-custom`} style={{display: 'flex', justifyContent: 'space-between'}}>
                      <Tooltip onClick={() => handleOnNodeSelect(blockMetadata)}>
                        <span style={{cursor: 'pointer'}}>{blockName}</span>
                      </Tooltip>
                      <Tooltip>
                        <MuiButton onClick={(e) => onDeleteCustomBlock(blockMetadata, vendorName, blockName)}>
                          <MdDelete size={24}/>
                        </MuiButton>
                      </Tooltip>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item key={`${index}-regular`} onClick={() => handleOnNodeSelect(blockMetadata)}>
                    <span style={{cursor: 'pointer'}}>{blockName}</span>
                  </ListGroup.Item>
                )
            ))}
        </ListGroup>
        </div>
      ))
    )
}