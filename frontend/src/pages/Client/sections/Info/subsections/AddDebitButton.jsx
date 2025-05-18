import React from 'react';
import { useDispatch } from 'react-redux';
import {addDebitRow} from "../../../../../store/debitSlice.js";
import {Button} from "../../../../../components/buttons/Button.jsx";


export const AddDebitButton = () => {
    const dispatch = useDispatch();

    const handleAddDebit = () => {
        dispatch(addDebitRow()); // Добавляем новую строку через Redux

        // Прокрутка к концу таблицы (опционально)
        setTimeout(() => {
            const table = document.querySelector('.table-container'); // Убедитесь, что у таблицы есть класс
            if (table) {
                table.scrollTo({
                    top: table.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 0);
    };

    return (
        <Button onClick={handleAddDebit}>
            Добавить дебиторскую задолженность
        </Button>
    );
};

