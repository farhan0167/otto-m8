import { useCallback, useEffect, useState } from 'react';
import { Handle, Position} from '@xyflow/react';
import './Block.css';

// Colors- {purple:F5EFFF, yellow: FEF9D9, orange:F6EACB, blue:BBE9FF, green:BFF6C3, red:FFC5C5}
const handleStyle = { left: 10 };
 
function ProcessBlock({ data }) {
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
 
  return (
    <>
        <div 
          className='process-block' 
          onClick={data.onClick}
        >
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
                  <p style={{margin:0, marginLeft: '8px'}}>{data.core_block_type}</p>
                </div>
                <div className='process-block-body'>
                  <p>Name: {data.label}</p>
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