import React from 'react';
import styled from 'styled-components';
import {handlesInputNumber} from "../inputs/handleInput.js"
import {CustomIcon, FilterGroup, Select, SelectWrapper} from "../select/Select.jsx";

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

const Input = styled.input``;

export const SumFilter = (props) => {
    return (
        <FilterGroup>
            <SelectWrapper style={{marginBottom: '16px'}}>
                    <Select
                        id="column"
                        value={props.nameFilteredField || ''}
                        onChange={event => props.setNameFilteredField(event.target.value)}
                    >
                        <option value="" disabled hidden>
                            Все категории
                        </option>
                        <option value="post_sum">Сумма по постановлениям</option>
                        <option value="cur_debt">Остаток по постановлениям</option>
                        <option value="arrest_sum">Арест имущества</option>
                        <option value="evaluation_sum">Оценка имущества</option>
                        <option value="realization_property_sum">Принудительная реализация</option>
                        <option value="price_reduction_sum">Торги 2 этап</option>
                        <option value="realization_sum_2">Результат принудительной реализации</option>
                        <option value="return_sum">Сумма возврата имущества плательщику</option>
                        <option value="debitor">Обращение взыскания на дебиторскую задолженность</option>
                    </Select>
                    <CustomIcon/>
            </SelectWrapper>

            <FilterInput>
                <Input
                    id="amount"
                    type="text"
                    placeholder="Сумма от (руб.)"
                    value={props.sum}
                    onChange={event => props.setSum(event.target.value)}
                    onKeyPress={handlesInputNumber.handleKeyPress}
                    onKeyDown={handlesInputNumber.handleKeyDown}
                    onInput={handlesInputNumber.handleInput}
                    onPaste={handlesInputNumber.handlePaste}
                />
            </FilterInput>
        </FilterGroup>
    );
};
