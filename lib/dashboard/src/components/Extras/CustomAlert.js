import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import CloseButton from 'react-bootstrap/CloseButton';

function CustomAlert( {alertText, level} ) {
  const [show, setShow] = useState(true);

  return (
    <>
      <Alert variant={level} onClose={() => setShow(false)} dismissible >
        <p>
          {alertText}
        </p>
      </Alert>
    </>
  );
}

export default CustomAlert;