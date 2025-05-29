import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {createDebitRow} from "../../../../store/debitSlice.js";
import AddDebitModal from "./AddDebitModal.jsx";
import { useParams } from "react-router";
import styled from "styled-components";


const Button = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
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

export const AddDebitButton = ({titleBtn}) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { inn } = useParams()

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveDebit = (data) => {
        dispatch(createDebitRow({ inn, newRow: data }))
    };

    return (
        <>
            <Button variant="primary" onClick={handleOpenModal}>
                {titleBtn}
            </Button>

            <AddDebitModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveDebit}
            />
        </>
    );
};


