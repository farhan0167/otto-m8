import {React} from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';
import LLMToolCalling from '../../LLMToolCalling';

const OllamaServerChatSideBarData = ({sideBarData, onDataChange}) => {
  return (
    <div>
        <Form.Group controlId="formResourceType">
            <Form.Label>Ollama Server Chat Endpoint</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.data.endpoint || ''}
            onChange={(e) => onDataChange('endpoint', e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formResourceType">
            <Form.Label>Model</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.data.model || 'llama3.2'}
            onChange={(e) => onDataChange('model', e.target.value)}
            />
            <CustomAlert 
                alertText="Make sure to configure your Input Block input type properly for this model."
                level="warning"
            />
        </Form.Group>
        <Form.Group controlId="formResourceType">
            <Form.Label>System Prompt</Form.Label>
            <Form.Control
            as="textarea"
            rows={3}
            value={sideBarData.data.system || ''}
            onChange={(e) => onDataChange('system', e.target.value)}
            />
        </Form.Group>
        <hr/>
        <LLMToolCalling onDataChange={onDataChange} />
    </div>
  )
}

export default OllamaServerChatSideBarData