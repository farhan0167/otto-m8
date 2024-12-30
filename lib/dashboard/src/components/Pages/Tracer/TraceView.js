import React, { useState } from 'react'
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import { Modal, Button } from 'react-bootstrap';

const TraceView = ({trace, show, handleCloseTrace}) => {

  return (
    <>
    <Modal show={show} onHide={handleCloseTrace} size="lg">
        <Modal.Header closeButton/>
        <Modal.Body>
            <JsonView 
                data={trace} 
                theme="summerfruit:light" 
                style={defaultStyles} 
                expandLevel={allExpanded}
            />
        </Modal.Body>
    </Modal>
    </>
  )
}

export default TraceView