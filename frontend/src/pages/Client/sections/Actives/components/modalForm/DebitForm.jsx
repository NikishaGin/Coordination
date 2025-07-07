import React, { useState } from 'react';
import styled from 'styled-components';
import {FormField, Input, InputIcon, InputLabel, InputWrapper} from "./styles/FormElements.jsx";
import {CancelButton, SaveButton} from "./styles/Buttons.jsx";
import { FileSignature as RubleSign } from 'lucide-react';
import { createRow } from "../../../../../../store/activesSlice.js";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { handlesInputNumber } from "../../../../../../utils/handleInput.js";


const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const parseNumber = (value) => {
    console.log(value)
    const cleaned = value.replace(/\s/g, "").replace(",", ".");
    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
};



const DebitForm = ({ onCancel }) => {
    const [data, setData] = useState({
        debitor_inn: "",
        debitor_names: "",
        debitor_address: "",
        date: null,
        total_sum: "",
    });
    const [error, setError] = useState("")

    const dispatch = useDispatch();
    const { inn } = useParams()


    const handleChange = nameField => event => {
        const value = event.target.value;
        if ((nameField === "debitor_inn") && (!/^\d*$/.test(value) || (value.length > 12)))
            return
        setData(prevData => ({ ...prevData, [nameField]: value }));
    }

    const handleSubmit = event => {
        event.preventDefault();
        if ((data.debitor_inn.trim().length === 0) || (data.debitor_names.trim().length === 0)) {
            setError("Обязательно укажите ИНН и наименование дебитора");
            return;
        }
        if (![10, 12].includes(data.debitor_inn.trim().length)) {
            setError("Неверный формат: ИНН должен содержать 10 или 12 символов");
            return;
        }
        const newRow = data
        if (newRow.total_sum.length !== 0)
            newRow.total_sum = parseNumber(newRow.total_sum);
        dispatch(createRow({ inn, data: newRow, nameActive: "debit" }))
        onCancel(event);
    };


    return (
        <>
            <ModalHeader>
                <ModalTitle>Добавить дебиторскую задолженность</ModalTitle>
            </ModalHeader>
            <Form onSubmit={handleSubmit} data-closemodal>
                <FormField>
                    <InputLabel>ИНН дебитора</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L12 20M20 12L4 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.debitor_inn}
                            onChange={handleChange('debitor_inn')}
                            placeholder="Введите ИНН дебитора"
                        />
                    </InputWrapper>
                </FormField>

                <FormField>
                    <InputLabel>Наименование дебитора</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L12 20M20 12L4 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.debitor_names}
                            onChange={handleChange('debitor_names')}
                            placeholder="Введите наименование дебитора"
                        />
                    </InputWrapper>
                </FormField>

                <FormField>
                    <InputLabel>Адрес дебитора</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L12 20M20 12L4 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.debitor_address}
                            onChange={handleChange('debitor_address')}
                            placeholder="Введите адрес дебитора"
                        />
                    </InputWrapper>
                </FormField>

                <FormField>
                    <InputLabel>Дата ходатайства</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L12 20M20 12L4 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </InputIcon>
                        <Input
                            type="date"
                            value={data.date}
                            onChange={handleChange('date')}
                            placeholder="Введите дату ходатайства"
                        />
                    </InputWrapper>
                </FormField>

                <FormField>
                    <InputLabel>Сумма по ходатайству, ₽</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <RubleSign size={16} stroke="#888" strokeWidth={2} />
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.total_sum}
                            onChange={handleChange('total_sum')}
                            onKeyDown={handlesInputNumber.handleKeyDown}
                            onKeyPress={handlesInputNumber.handleKeyPress}
                            onInput={handlesInputNumber.handleInput}
                            onPaste={handlesInputNumber.handlePaste}
                            placeholder="Введите сумму по ходатайству, ₽"
                        />
                    </InputWrapper>
                </FormField>
                <div style={{ color: '#ff6b6b', fontSize: '12px', height: "5px" }}>{error}</div>
                <ButtonGroup>
                    <CancelButton type="button" data-closemodal onClick={onCancel}>Отменить</CancelButton>
                    <SaveButton type="submit">Сохранить</SaveButton>
                </ButtonGroup>
            </Form>
        </>
    );
};

export default DebitForm;