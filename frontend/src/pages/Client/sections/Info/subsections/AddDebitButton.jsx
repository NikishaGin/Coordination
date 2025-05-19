import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {addDebitRow, createDebitRow} from "../../../../../store/debitSlice.js";
import AddDebitModal from "./AddDebitModal.jsx";
import Button from "./Button.jsx";
import { useParams } from "react-router";

export const AddDebitButton = () => {
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
        dispatch(createDebitRow({ inn, newRow: data })).unwrap()
            .then(() => {
                setTimeout(() => {
                    const table = document.querySelector('.table-container');
                    if (table) {
                        table.scrollTo({
                            top: table.scrollHeight,
                            behavior: 'smooth',
                        });
                    }
                }, 0);
            })
            .catch((error) => {
                console.error("Ошибка при сохранении строки:", error);
            });
    };



    return (
        <>
            <Button variant="primary" onClick={handleOpenModal}>
                Добавить дебиторскую задолженность
            </Button>

            <AddDebitModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveDebit}
            />
        </>
    );
};


