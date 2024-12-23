import { useCallback } from 'react';
import { Handle, Position, NodeToolbar} from '@xyflow/react';
import { IoAddOutline } from "react-icons/io5";

 
const handleStyle = { left: 10 };
 
function PlaceholderBlock({ data }) {
  const addIconClick = () => {
    const addButton = document.getElementById("add-block-button");
    if (addButton) {
      addButton.click(); // Trigger the click event on the Add button
    }

  }
  return (
    <>
        <div className='placeholder-block' style={{height: '70px'}}>
            <Handle type="target" position={Position.Left} id="a" />
            <div 
              style={
                {
                  textAlign: 'center', 
                  alignItems: 'center',
                  paddingTop: '6px',

                }}
            >
              <IoAddOutline
              className='add-icon' 
              onClick={addIconClick}
              size={25}/>
                <p style={{fontSize: '6px', marginBottom: '0'}}>Start by pressing</p>
                <p style={{fontSize: '8px'}}>Add Block</p>
            </div>
            <Handle type="source" position={Position.Right} id="b" />
        </div>

    </>
  );
}

export default PlaceholderBlock