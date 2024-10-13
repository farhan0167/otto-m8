import {React} from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';
import LLMToolCalling from '../../LLMToolCalling';

const OpenAIChatSideBarData = ({sideBarData, onDataChange}) => {
  return (
    <div>
        <Form.Group controlId="formResourceType">
            <Form.Label>OpenAI API Key</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.openai_api_key || ''}
            onChange={(e) => onDataChange('openai_api_key', e.target.value)}
            />
        </Form.Group>
        <Form.Group controlId="formResourceType">
            <Form.Label>Model</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.model || 'gpt-4o-mini'}
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
            value={sideBarData.system || ''}
            onChange={(e) => onDataChange('system', e.target.value)}
            />
        </Form.Group>
        <hr/>
        <LLMToolCalling onDataChange={onDataChange} tools={sideBarData}/>
    </div>
  )
}

export default OpenAIChatSideBarData