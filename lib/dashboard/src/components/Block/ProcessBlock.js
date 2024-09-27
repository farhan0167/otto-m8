import { useCallback } from 'react';
import { Handle, Position} from '@xyflow/react';
import './Block.css';

// Colors- {purple:F5EFFF, yellow: FEF9D9, orange:F6EACB, blue:BBE9FF, green:BFF6C3, red:FFC5C5}
const handleStyle = { left: 10 };
 
function ProcessBlock({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
        <div 
          className='process-block' 
          onClick={data.onClick}
          style={{backgroundColor: '#C2F784'}}
        >
            <Handle type="target" position={Position.Left} id="a" />
            <div>
                <img src={data.logo.src} style={{height: data.logo.height, width: data.logo.width}}/>
                <hr style={{marginTop: '1px', marginBottom: '1px'}}/>
                <p>Name: {data.label}</p>
            </div>
            <Handle type="source" position={Position.Right} id="b" />
        </div>

    </>
  );
}

export default ProcessBlock