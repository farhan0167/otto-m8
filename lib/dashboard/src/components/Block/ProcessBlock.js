import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow} from '@xyflow/react';
import { Form } from 'react-bootstrap';
import './Block.css';
import HuggingFaceBlockUI from './HuggingFace/ModelCard/blockUI';
import OpenAIBlockUI from './OpenAI/Chat/blockUI';
import HTTPPostBlockUI from './HTTP/POST/blockUI';
import LambdaBlockUI from './Lambda/blockUI';
import OllamaChatBlockUI from './Ollama/Chat/blockUI';
import { IoIosCloseCircleOutline } from "react-icons/io";
import HuggingFaceMultimodalBlockUI from './HuggingFace/MultimodalPipeline/blockUI';

// Colors- {purple:F5EFFF, yellow: FEF9D9, orange:F6EACB, blue:BBE9FF, green:BFF6C3, red:FFC5C5}
const handleStyle = { left: 10 };
 
function ProcessBlock({ id, data }) {
  const reactFlowInstance = useReactFlow();
  const colors = ['#F5EFFF', '#FEF9D9', '#F6EACB', '#BBE9FF', '#BFF6C3', '#FFC5C5', '#C2F784'];
  const [backgroundColor, setBackgroundColor] = useState(colors[0]); // Set initial color

  useEffect(() => {
    // pick a random color and set background color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBackgroundColor(randomColor);
  }, []);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const handleDeleteBlock = (e) => {
    e.stopPropagation(); // Prevent triggering node selection
    reactFlowInstance.setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };
 
  return (
    <>
        <div 
          className='process-block' 
          onClick={data.onClick}
        >
            <IoIosCloseCircleOutline 
            className='block-delete-icon' 
            onClick={handleDeleteBlock} 
            size={15} 
            style={{
              position: 'absolute',
              cursor: 'pointer'
            }}
            />
            <Handle type="target" position={Position.Left} id="a" />
            <span 
              style={{ 
                position: 'absolute', 
                left: '-16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                fontSize: '5px' 
              }}
            >
              input
            </span>
            <div>
                <div className='process-block-header' style={{backgroundColor: backgroundColor}}>
                  {data.logo && 
                      <img src={data.logo.src} style={{height: data.logo.height, width: data.logo.width}}/>
                  }
                  <p style={{margin:0, marginLeft: '8px'}}>{data.reference_core_block_type}</p>
                </div>
                <div className='process-block-body'>
                    <Form>
                        <Form.Group className='form-group' controlId="formResourceType">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                            type="text"
                            value={data.custom_name}
                            disabled
                            />
                        </Form.Group>
                    </Form>
                    {data.reference_core_block_type === 'hugging_face_model_card' && <HuggingFaceBlockUI data={data}/>}
                    {data.reference_core_block_type === 'hugging_face_multimodal' && <HuggingFaceMultimodalBlockUI data={data}/>}
                    {data.reference_core_block_type === 'openai_chat' && <OpenAIBlockUI data={data}/>}
                    {data.reference_core_block_type === 'http_post_request' && <HTTPPostBlockUI data={data}/>}
                    {data.reference_core_block_type === 'lambda_function' && <LambdaBlockUI data={data}/>}
                    {data.reference_core_block_type === 'ollama_server_chat' && <OllamaChatBlockUI data={data}/>}
                </div>
            </div>
            <Handle type="source" position={Position.Right} id="b" />
            <span 
              style={{ 
                position: 'absolute', 
                right: '-18px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                fontSize: '5px' 
              }}
            >
              output
            </span>
        </div>

    </>
  );
}

export default ProcessBlock