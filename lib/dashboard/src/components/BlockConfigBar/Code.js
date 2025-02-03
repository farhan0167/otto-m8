
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { CodeEditor } from '../Pages/Lambdas/CodeEditor';
import { sha1 } from 'js-sha1';
import { useAuth } from '../../contexts/AuthContext';




export const BlockCode = ({blockDataConfig, onDataChange, show, handleClose}) => {
    const [code, setCode] = useState(blockDataConfig.source_code || null);
    const originalHash = blockDataConfig.source_hash;
    const { token } = useAuth();

    function createNewFilePath(fullPath, block_id) {
        const parts = fullPath.split("/");
        const index = parts.indexOf("implementations");
        // Since "implementations" is guaranteed to exist, no need to check index !== -1
        const filePath = parts.slice(0, index + 1).join("/");
        return `${filePath}/custom/blocks/${block_id}.py`;
    }

    useEffect(() => {
        if (code){
          const codeHash = sha1(code);
          if (codeHash !== originalHash) {
              const newFileName = `custom_${blockDataConfig.label}`;
              const newFilePath = createNewFilePath(blockDataConfig.source_path, newFileName);
              const core_block_type = blockDataConfig.core_block_type

              fetch('http://localhost:8000/save_block_code', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      "Authorization": `Bearer ${token}` 
                  },
                  body: JSON.stringify({
                      source_code: code,
                      source_path: newFilePath,
                      file_name: newFileName,
                      core_block_type
                  }),
              })
              .then(response => {
                  if (response.ok) {
                      console.log('Source code saved successfully.');
                      onDataChange('source_path', newFilePath);
                      onDataChange('source_code', code);
                      onDataChange('source_hash', codeHash);
                  } else {
                      console.error('Failed to save source code.');
                  }
              })
          }
        }
    }, [code]);

    return (
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Source Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeEditor
            code={code}
            setCode={setCode}
          />
        </Modal.Body>
      </Modal>
    )
  }