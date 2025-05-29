import React, {useState} from 'react';
import {ButtonsSwitches} from "./ButtonsSwitches.jsx";
import styled from "styled-components";
import {StatusFilter} from "./StatusFilter.jsx";
import {SumFilter} from "./SumFilter.jsx";
import {parseNumber} from "../../utils/formatData.js";
import {useDispatch, useSelector} from "react-redux";
import {setFilterCategory, setFilterStatusIp, setFilterSum} from "../../store/globalSlice.js";
import {IconButton} from "../IconButton.jsx";
import {ResetButton} from "../ResetButton.jsx";

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
    const [statusIP, setStatusIP] = useState(useSelector((state) => state.global.filters.status_ip));
    const [category, setCategory] = useState(useSelector((state) => state.global.filters.category));
    const [nameFilteredField, setNameFilteredField] = useState(useSelector((state) => state.global.filters.name_filtered_field));
    const [sum, setSum] = useState(useSelector((state) => state.global.filters.sum));

    const handleApply = () => {
        if (statusIP.length > 0)
            dispatch(setFilterStatusIp(statusIP));
        if (category.length > 0)
            dispatch(setFilterCategory(category));
        if ((nameFilteredField.length > 0) && sum.length > 0) {
            const valueSum = parseNumber(sum);
            dispatch(setFilterSum({sum: valueSum, name_filtered_field: nameFilteredField}));
        }
    };

    const handleReset = () => {
        dispatch(setFilterStatusIp(""))
        dispatch(setFilterCategory(""))
        dispatch(setFilterSum({sum: "", name_filtered_field: ""}))
        setStatusIP('');
        setCategory('');
        setNameFilteredField("");
        setSum("");
    };


    const [activeFilter, setActiveFilter] = useState('status');

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

        {activeFilter === 'status' &&
            <StatusFilter statusIP={statusIP} setStatusIP={setStatusIP} category={category} setCategory={setCategory}/>}
        {activeFilter === 'sum' &&
            <SumFilter nameFilteredField={nameFilteredField} setNameFilteredField={setNameFilteredField} sum={sum}
                       setSum={setSum}/>}

        <ButtonsContainer>
            <ActionButton type="primary" onClick={handleApply}>Применить</ActionButton>
            <ActionButton type="secondary" onClick={handleReset}>Сбросить</ActionButton>
        </ButtonsContainer>
    </WrapperFilter>
};

