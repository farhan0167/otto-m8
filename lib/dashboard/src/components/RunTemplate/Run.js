import React, { useState } from 'react'
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import TextInput from '../InputHandles/TextInput';
import { UploadFileNames } from '../InputHandles/UploadFile';
import { UploadFile } from '../InputHandles/UploadFile';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';

const Run = ({
    blockData,
    showChatButton,
    handleChatButtonClick,
    inputTextBlocks,
    inputUploadBlocks,
    inputData,
    setInputData,
    uploadFileNames,
    setUploadFileName,
    uploadFilePreview,
    setUploadFilePreview,
    handleSubmit
}) => {
  return (
    <Row>
            <Col xs={6} sm={6} lg={6}>
                <Card style={{ minHeight: '300px' }}>
                  <Card.Body>
                    <Card.Title>Input</Card.Title>
                    <Form onSubmit={handleSubmit}>
                      <div>
                        { inputTextBlocks && inputTextBlocks.map((block, index) => (
                          <TextInput key={index} block={block}  inputData={inputData} setInputData={setInputData}/>
                        ))}
                      </div>
                      <div>
                          <UploadFileNames uploadFileNames={uploadFileNames} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        { inputUploadBlocks && inputUploadBlocks.map((block, index) => (
                          <UploadFile 
                            key={index} 
                            block={block} 
                            inputData={inputData} 
                            setInputData={setInputData}
                            setUploadFileName={setUploadFileName}
                            preview={uploadFilePreview}
                            setPreview={setUploadFilePreview}
                          />
                        )
                        )}
                      </div>
                      <div style={{marginTop: '10px'}}>
                        <Button variant="primary" type="submit">
                          Run Workflow
                        </Button>
                        {showChatButton && (
                            <Button 
                            style={{ marginLeft: '10px' }} 
                            variant="primary"
                            onClick={handleChatButtonClick}
                            >
                              Chat
                            </Button>
                        )}
                      </div>
                    </Form>
                  </Card.Body>
                    
                </Card>
            </Col>
            <Col xs={6} sm={6} lg={6}>
                <Card style={{ minHeight: '300px'}}>
                    <Card.Body>
                        <Card.Title>Output</Card.Title>
                        {blockData.message? <JsonView data={JSON.parse(blockData.message)} shouldExpandNode={allExpanded} style={defaultStyles} />: null}
                    </Card.Body>
                </Card>
            </Col>
    </Row>
  )
}

export default Run