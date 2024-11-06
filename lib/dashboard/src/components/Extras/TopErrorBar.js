import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { MdErrorOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";


function TopErrorBar({errorMessage, topErrorBarShow, setTopErrorBarShow}) {
  return (
    <ToastContainer position='top-center'>
        <Toast show={topErrorBarShow}>
            <Toast.Body>
                <div style={{display:'flex'}}>
                    <div>
                        <MdErrorOutline size={20} color='#FF5733'/> Error : {errorMessage}
                    </div>
                    <div style={{marginLeft:'auto'}}>
                        <IoMdClose
                        onClick={()=> setTopErrorBarShow(false)}
                        size={25}
                    />
                    </div>
                </div>
            </Toast.Body>
        </Toast>
    </ToastContainer>
  );
}

export default TopErrorBar;