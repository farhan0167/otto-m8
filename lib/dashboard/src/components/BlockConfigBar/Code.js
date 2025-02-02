
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { CodeEditor } from '../Pages/Lambdas/CodeEditor';



export const BlockCode = ({blockDataConfig, show, handleClose}) => {
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