import React, {useState} from 'react';
import styled from 'styled-components';
import {handlesInputNumber} from "../inputs/handleInput.js"
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

    return (
        <>
            <CustomSelect
                value={props.nameFilteredField}
                onChange={event => props.setNameFilteredField(event.target.value)}
                placeholder="Выбор колонки"
                options={[
                    {value: 'post_sum', label: 'Сумма по постановлениям'},
                    {value: 'cur_debt', label: 'Остаток по постановлениям'},
                    {value: 'arrest', label: 'Арест имущества'},
                    {value: 'evaluation', label: 'Оценка имущества'},
                    {value: 'realization_property', label: 'Принудительная реализация'},
                    {value: 'price_reduction', label: 'Торги 2 этап'},
                    {value: 'realization_sum_2', label: 'Результат принудительной реализации'},
                    {value: 'return_sum', label: 'Сумма возврата имущества плательщику'},
                    {value: 'debitor', label: 'Обращение взыскания на дебиторскую задолженность'},
                ]}
            />
            <Input
                type="text"
                placeholder="Сумма от (руб.)"
                value={props.sum}
                onChange={event => props.setSum(event.target.value)}
                onKeyPress={handlesInputNumber.handleKeyPress}
                onKeyDown={handlesInputNumber.handleKeyDown}
                onInput={handlesInputNumber.handleInput}
                onPaste={handlesInputNumber.handlePaste}
            />
        </>
    );
};