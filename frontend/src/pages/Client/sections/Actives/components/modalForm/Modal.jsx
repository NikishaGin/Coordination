import React, { useState} from 'react';
import styled from 'styled-components';



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const ModalContent = styled.div`
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }
`;

const Modal = ({ Form, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };

    const onCloseByClickOnOverlay = event => {
        if (event.target.dataset.closemodal)
            handleClose();
    }


    return (
        <ModalOverlay style={{ animation: !isClosing ? 'fadeIn 0.2s ease-in forwards' : 'fadeOut 0.2s ease-in forwards' }} data-closemodal onClick={onCloseByClickOnOverlay}>
            <ModalContent style={{ animation: !isClosing ? 'slideIn 0.2s ease-in forwards' : 'slideOut 0.2s ease-in forwards' }}>
                <Form onCancel={handleClose} />
            </ModalContent>
        </ModalOverlay>
    );
};

export default Modal;