import {React} from 'react'
import { Form } from 'react-bootstrap';
import CustomAlert from '../../../Extras/CustomAlert';
import LLMToolCalling from '../../../../features/LLMToolCalling/LLMToolCalling';
import { InstantRun } from '../../../InstantRuns/InstantRun';
import { PromptTemplate } from '../../../../features/InputParsers/LLMPromptTemplate/PromptTemplate';

const OpenAIChatSideBarData = ({sideBarData, connectedSourceNodes, onDataChange}) => {
  return (
    <div>
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>OpenAI API Key</Form.Label>
            <Form.Control
            type="text"
            value={sideBarData.openai_api_key || ''}
            onChange={(e) => onDataChange('openai_api_key', e.target.value)}
            />
        </Form.Group>
        <Form.Group className='form-group' controlId="formResourceType">
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
        <Form.Group className='form-group' controlId="formResourceType">
            <Form.Label>System Prompt</Form.Label>
            <Form.Control
            as="textarea"
            rows={1}
            value={sideBarData.system || ''}
            onChange={(e) => onDataChange('system', e.target.value)}
            />
        </Form.Group>
        <PromptTemplate 
            onDataChange={onDataChange} 
            blockData={sideBarData} 
            connectedSourceNodes={connectedSourceNodes}
        />
        <hr/>
        <LLMToolCalling onDataChange={onDataChange} tools={sideBarData}/>
        <hr/>
        <InstantRun blockData={sideBarData} />
    </div>
  )
}

export default OpenAIChatSideBarData