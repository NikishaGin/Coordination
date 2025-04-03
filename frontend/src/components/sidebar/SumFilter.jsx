import React, {useState} from 'react';
import styled from 'styled-components';
import {CustomSelect} from "./CustomSelect.jsx";

// Стиль для инпута
const Input = styled.input`
  width: 132.5px;
  font-size: 14px;
  color: rgb(148, 160, 184);
  background-color: rgb(12, 16, 23);
  outline: none;
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 4px;
  height: 40px;
  padding: 8px 0px 8px 12px; // Внутренние отступы (справа место для иконки)

  &::placeholder {
    color: rgb(148, 160, 184);
  }

  &:focus {
    border-color: rgb(51, 153, 255); // Изменение цвета границы при фокусе
  }
  
  /* Скрываем стрелки у input[type="number"] */
  &[type='number'] {
    -moz-appearance: textfield;
  }

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const SumFilter = (props) => {
    const [value, setValue] = useState('');

    // Обработка изменения значения инпута
    const handleChange = (e) => {
        const filteredValue = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        setValue(filteredValue);
    };

    return (
        <>
            <CustomSelect
                value={props.statusIP}
                onChange={props.setStatusIP}
                placeholder="Выбор колонки"
                options={[
                    {value: 'active', label: 'Сумма по постановлениям'},
                    {value: 'inactive', label: 'Остаток по постановлениям'},
                    {value: 'inactive', label: 'Арест имущества'},
                    {value: 'inactive', label: 'Оценка имущества'},
                    {value: 'inactive', label: 'Принудительная реализация'},
                    {value: 'inactive', label: 'Торги 2 этап'},
                    {value: 'inactive', label: 'Результат принудительной реализации'},
                    {value: 'inactive', label: 'Сумма возврата имущества плательщику'},
                    {value: 'inactive', label: 'Обращение взыскания на дебиторскую задолженность'},
                ]}
            />
            <Input
                type="text"
                placeholder="Введите сумму"
                value={value}
                onChange={handleChange}
            />
        </>
    );
};