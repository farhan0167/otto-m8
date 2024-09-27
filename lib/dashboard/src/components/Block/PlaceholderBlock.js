import { useCallback } from 'react';
import { Handle, Position, NodeToolbar} from '@xyflow/react';
import { Button } from 'react-bootstrap';
 
const handleStyle = { left: 10 };
 
function PlaceholderBlock({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
        <div className='placeholder-block' style={{height: '70px'}}>
            <Handle type="target" position={Position.Left} id="a" />
            <div style={{textAlign: 'center', alignItems: 'center'}}>
                <p style={{marginBottom: '1px'}}>Get Started by Clicking</p>
                <p>Add Block</p>
            </div>
            <Handle type="source" position={Position.Right} id="b" />
        </div>

    </>
  );
}

export default PlaceholderBlock