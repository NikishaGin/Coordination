import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { StatusFilter } from "./StatusFilter.jsx";
import { AmountFilter } from "./AmountFilter.jsx";
import { parseNumber } from "../../utils/formatData.js";
import { getFilters, setFilterCategory, setFilterStatusIp, setFilterAmount } from "../../store/main/mainSlice.js";


const WrapperFilter = styled.div`
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
`;

// Стиль для контейнера кнопок "Применить" и "Сбросить"
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const FilterToggle = styled.div`
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  margin-bottom: 24px;
  background-color: #232339;
  overflow: hidden;
`;

const FilterToggleButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: ${props => props.active ? '#3a3a6a' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#a0a0a0'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#3a3a6a' : '#2a2a3a'};
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: ${props => props.type === 'primary' ? '#3a3a6a' : 'transparent'};
  color: #ffffff;
  border: 1px solid ${props => props.type === 'primary' ? '#3a3a6a' : '#333'};
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.type === 'primary' ? '#4a4a7a' : '#2a2a3a'};
  }
`;

export const FilterPanel = () => {
    const dispatch = useDispatch();

    const filters = getFilters();
    const [statusIP, setStatusIP] = useState(filters.statusIP);
    const [categoryId, setCategoryId] = useState(filters.categoryId);
    const [amount, setAmount] = useState(filters.amount);

    const [activeFilter, setActiveFilter] = useState('status');


    const handleApply = () => {
        if (statusIP.length > 0)
            dispatch(setFilterStatusIp(statusIP));
        if (categoryId.length > 0)
            dispatch(setFilterCategory(categoryId));
        if ((amount.field.length > 0) && amount.value)
            dispatch(setFilterAmount({
                field: amount.field,
                value: parseNumber(amount.value),
            }));
    };

    const handleReset = () => {
        dispatch(setFilterStatusIp(""))
        dispatch(setFilterCategory(""))
        dispatch(setFilterAmount({ field: "", value: null }))
        setStatusIP("");
        setCategoryId(null);
        setAmount({ field: "", value: null });
    };

    const handleFilterToggle = (filter) => {
        setActiveFilter(filter);
    };

    return <WrapperFilter>
        <FilterToggle>
            <FilterToggleButton
                active={activeFilter === 'status'}
                onClick={() => handleFilterToggle('status')}
            >
                По статусу
            </FilterToggleButton>
            <FilterToggleButton
                active={activeFilter === 'sum'}
                onClick={() => handleFilterToggle('sum')}
            >
                По сумме
            </FilterToggleButton>
        </FilterToggle>

        { activeFilter === 'status' && <StatusFilter statusIP={statusIP} setStatusIP={setStatusIP} categoryId={categoryId} setCategoryId={setCategoryId}/> }
        { activeFilter === 'sum'    && <AmountFilter amount={amount} setAmount={setAmount} /> }

        <ButtonsContainer>
            <ActionButton type="primary" onClick={handleApply}>Применить</ActionButton>
            <ActionButton type="secondary" onClick={handleReset}>Сбросить</ActionButton>
        </ButtonsContainer>
    </WrapperFilter>
};

