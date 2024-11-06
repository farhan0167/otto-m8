import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import CloseButton from 'react-bootstrap/CloseButton';

function CustomAlert( {alertText, level, dismissible=true} ) {
  const [show, setShow] = useState(true);

  return (
    <>
      <Alert 
      variant={level} 
      onClose={() => setShow(false)} 
      dismissible={dismissible} 
      >
        <p style={{margin:'0', fontSize:'12px'}}>
          {alertText}
        </p>
      </Alert>
    </>
  );
}

export default CustomAlert;