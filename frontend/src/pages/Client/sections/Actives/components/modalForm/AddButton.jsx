import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal.jsx';
import Snackbar from "../table/Snacbar.jsx";


const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 16px;
  position: sticky;
  bottom: 0;
  z-index: 2;
`;

const StyledButton = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #4a4a8a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;


export const AddButton = ({ titleBtn, Form }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <ButtonBox>
            <StyledButton onClick={openModal}>{titleBtn}</StyledButton>
            <Snackbar
                message="Данные успешно сохранены!"
                visible={snackbarVisible}
                onClose={() => setSnackbarVisible(false)}
            />
            {isModalOpen && <Modal Form={Form} setSnackbarVisible={setSnackbarVisible} onClose={closeModal} />}
        </ButtonBox>
    );
};

