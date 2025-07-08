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
  margin-top: 10px;
`;

const parseNumber = (value) => {
    const cleaned = value.replace(/\s/g, "").replace(",", ".");
    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
};



const OtherAssetForm = ({ onCancel }) => {
    const [data, setData] = useState({
        name: "",
        cost: "",
    });
    const [error, setError] = useState("")

    const dispatch = useDispatch();
    const { inn } = useParams()


    const handleChange = nameField => event => {
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [nameField]: value }));
        if (error.length > 0)
            setError("");
    }

    const handleSubmit = event => {
        event.preventDefault();
        if (data.name.trim().length === 0) {
            setError("Обязательно укажите наименование актива");
            return;
        }
        const newRow = data
        if (newRow.cost.length !== 0)
            newRow.cost = parseNumber(newRow.cost);
        dispatch(createRow({ inn, data: newRow, nameActive: "another" }))
        onCancel();
    };

    const isValidForm = data.name.trim().length !== 0

    return (
        <>
            <ModalHeader>
                <ModalTitle>Добавить иные активы</ModalTitle>
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
                <FormField>
                    <InputLabel>Наименование</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4L12 20M20 12L4 12" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.name}
                            onChange={handleChange('name')}
                            placeholder="Введите наименование актива"
                        />
                    </InputWrapper>
                </FormField>

                <FormField>
                    <InputLabel>Стоимость, ₽</InputLabel>
                    <InputWrapper>
                        <InputIcon>
                            <RubleSign size={16} stroke="#888" strokeWidth={2} />
                        </InputIcon>
                        <Input
                            type="text"
                            value={data.cost}
                            onChange={handleChange('cost')}
                            onKeyDown={handlesInputNumber.handleKeyDown}
                            onKeyPress={handlesInputNumber.handleKeyPress}
                            onInput={handlesInputNumber.handleInput}
                            onPaste={handlesInputNumber.handlePaste}
                            placeholder="Введите стоимость, ₽"
                        />
                    </InputWrapper>
                </FormField>
                <div style={{ color: '#ff6b6b', fontSize: '12px', height: "5px" }}>{error}</div>
                <ButtonGroup>
                    <CancelButton type="button" onClick={onCancel}>Отменить</CancelButton>
                    <SaveButton type="submit" className={isValidForm ? "" : "disabled"}>Сохранить</SaveButton>
                </ButtonGroup>
            </Form>
        </>
    );
};

export default OtherAssetForm;