import React from 'react';
import styled from 'styled-components';
import { CustomIcon, FilterGroup, Select, SelectWrapper } from "../select/Select.jsx";
import { handlesInputNumber } from "../../utils/handleInput.js"
import { formatNumber, parseNumber } from "../../utils/formatData.js";

const FilterInput = styled.div`
  margin-bottom: 16px;

  input[type="text"] {
    width: 100%;
    padding: 10px;
    background-color: #232339;
    border: 1px solid #333;
    border-radius: 4px;
    color: #ffffff;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #a0a0ff;
    }
  }
`;



export const AmountFilter = (props) => {
    const { amount, setAmount } = props;
    const amountValue = amount.value ? formatNumber(amount.value) : '';

    const handleSelect = event => setAmount(prevValue => ({ ...prevValue, field: event.target.value }));
    const handleInput = event => setAmount(prevValue => ({ ...prevValue, value: parseNumber(event.target.value) }));

    return (
        <FilterGroup>
            <SelectWrapper style={{marginBottom: '16px'}}>
                    <Select value={amount.field} onChange={handleSelect}>
                        <option value="" disabled hidden>Все категории</option>
                        <option value="resolution.amount">Сумма по постановлениям</option>
                        <option value="resolution.balance">Остаток по постановлениям</option>
                        <option value="actives.totalSum">Сумма активов и дебиторской задолженности</option>
                        <option value="actives.arrest">Арест имущества</option>
                        <option value="actives.wanted">Розыск имущества</option>
                        <option value="actives.evaluation">Оценка имущества</option>
                        <option value="actives.realizationFirst">Принудительная реализация</option>
                        <option value="actives.realizationSecond">Торги 2 этап</option>
                        <option value="actives.realizationResult">Результат принудительной реализации</option>
                        <option value="actives.refundProperty">Сумма возврата имущества плательщику</option>
                        <option value="actives.debitForeclosure">Обращение взыскания на дебиторскую задолженность</option>
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>

            <FilterInput>
                <input
                    type="text"
                    placeholder="Сумма от (руб.)"
                    value={amountValue}
                    onChange={handleInput}
                    onKeyPress={handlesInputNumber.handleKeyPress}
                    onKeyDown={handlesInputNumber.handleKeyDown}
                    onInput={handlesInputNumber.handleInput}
                    onPaste={handlesInputNumber.handlePaste}
                />
            </FilterInput>
        </FilterGroup>
    );
};
