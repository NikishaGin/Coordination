import React, { useState} from 'react';
import styled from 'styled-components';
import AssetForm from './AssetForm';
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import {createRow} from "../../../../store/activesSlice.js";

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
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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
  animation: slideIn 0.3s ease-out;
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
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const AssetModal = ({ onClose }) => {

    const dispatch = useDispatch();
    const { inn } = useParams()

    const [isClosing, setIsClosing] = useState(false);


    const handleSave = (data) => {
        dispatch(createRow({ inn, newRow: data }))
        handleClose();
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200);
    };


    return (
        <ModalOverlay style={isClosing ? { animation: 'fadeOut 0.2s ease-in forwards' } : {}}>
            <ModalContent style={isClosing ? { animation: 'slideOut 0.2s ease-in forwards' } : {}}>
                <ModalHeader>
                    <ModalTitle>Добавить иные активы</ModalTitle>
                </ModalHeader>
                <AssetForm onSave={handleSave} onCancel={handleClose} />
            </ModalContent>
        </ModalOverlay>
    );
};

export default AssetModal;