import React, { useState } from 'react';
import styled from 'styled-components';
import {FormField, Input, InputIcon, InputLabel, InputWrapper} from "./styles/FormElements.jsx";
import {CancelButton, SaveButton} from "./styles/Buttons.jsx";


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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L12 22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
                <CancelButton type="button" onClick={onCancel}>Отменить</CancelButton>
                <SaveButton type="submit" disabled={!isFormValid}>Сохранить</SaveButton>
            </ButtonGroup>
        </Form>
    );
};

export default AssetForm;