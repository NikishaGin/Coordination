import React, { useState } from 'react';
import styled from 'styled-components';
import AssetModal from './AssetModal';

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

export const AddButton = ({ titleBtn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <StyledButton onClick={openModal}>{titleBtn}</StyledButton>
            {isModalOpen && <AssetModal onClose={closeModal} />}
        </>
    );
};

