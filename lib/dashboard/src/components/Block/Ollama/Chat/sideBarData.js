import {React} from 'react'
import { Form } from 'react-bootstrap';
import LLMToolCalling from '../../../../features/LLMToolCalling/LLMToolCalling';
import { PromptTemplate } from '../../../../features/InputParsers/LLMPromptTemplate/PromptTemplate';

const OllamaServerChatSideBarData = ({sideBarData, connectedSourceNodes, onDataChange}) => {
  return (
    <div>
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Ollama Server Chat Endpoint</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.endpoint || ''}
            onChange={(e) => onDataChange('endpoint', e.target.value)}
            />
        </Form.Group>
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>Model</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.model || 'llama3.2'}
            onChange={(e) => onDataChange('model', e.target.value)}
            />
        </Form.Group>
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>System Prompt</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            value={sideBarData.system || ''}
            onChange={(e) => onDataChange('system', e.target.value)}
            />
        </Form.Group>
        <PromptTemplate
            blockData={sideBarData}
            onDataChange={onDataChange}
            connectedSourceNodes={connectedSourceNodes}
        />
        <hr/>
        <LLMToolCalling onDataChange={onDataChange} tools={sideBarData}/>
    </div>
  )
}

export default OllamaServerChatSideBarData