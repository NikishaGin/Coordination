import React, { useState } from 'react';
import styled from 'styled-components';
import {FormField, Input, InputIcon, InputLabel, InputWrapper} from "./styles/FormElements.jsx";
import {CancelButton, SaveButton} from "./styles/Buttons.jsx";
import { FileSignature as RubleSign } from 'lucide-react';


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

const AssetForm = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [costError, setCostError] = useState('');

    const validateCost = (value) => {
        // Allow only numbers and commas
        if (value === '') {
            setCostError('');
            return true;
        }

        const isValid = /^[0-9,]+$/.test(value);
        setCostError(isValid ? '' : 'Только цифры и запятые разрешены');
        return isValid;
    };

    const handleCostChange = (e) => {
        const value = e.target.value;
        setCost(value);
        validateCost(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && cost && !costError) {
            onSave({ name, cost });
        }
    };

    const isFormValid = name.trim() !== '' && cost.trim() !== '' && !costError;

    return (
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите наименование актива"
                    />
                </InputWrapper>
            </FormField>

            <FormField>
                <InputLabel>Стоимость</InputLabel>
                <InputWrapper>
                    <InputIcon>
                        <RubleSign size={16} stroke="#888" strokeWidth={2} />
                    </InputIcon>
                    <Input
                        type="text"
                        value={cost}
                        onChange={handleCostChange}
                        placeholder="Введите стоимость"
                        error={costError}
                    />
                </InputWrapper>
                {costError && <div style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px' }}>{costError}</div>}
            </FormField>

            <ButtonGroup>
                <CancelButton type="button" data-closemodal onClick={onCancel}>Отменить</CancelButton>
                <SaveButton type="submit" disabled={!isFormValid}>Сохранить</SaveButton>
            </ButtonGroup>
        </Form>
    );
};

export default AssetForm;