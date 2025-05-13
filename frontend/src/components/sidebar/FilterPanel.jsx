import React, {useState} from 'react';
import {ButtonsSwitches} from "./ButtonsSwitches.jsx";
import styled from "styled-components";
import {FilterButtons} from "./FilterButtons.jsx";
import {StatusFilter} from "./StatusFilter.jsx";
import {SumFilter} from "./SumFilter.jsx";
import {useDispatch, useSelector} from "react-redux";
import { setFilterCategory, setFilterStatusIp, setFilterSum } from "../../store/globalSlice.js";


const WrapperFilter = styled.div`
  padding: 10px;
  margin-top: 12px;
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border-radius: 4px; // Скругление углов
`;

// Стиль для контейнера кнопок
const ToggleButtonGroup = styled.div`
  display: flex;
  overflow: hidden; // Убираем видимость границ внутри
  margin-bottom: 24px; // Отступ снизу
`;


// Стиль для контейнера селектов
const SelectsContainer = styled.div`
  display: flex;
  gap: 12px; // Расстояние между селектами
  margin-bottom: 12px; // Отступ снизу
`;

// Стиль для контейнера кнопок "Применить" и "Сбросить"
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center; // Кнопки по центру
  gap: 12px; // Расстояние между кнопками
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
            const valueSum = parseFloat(sum.replace(/,/g, ".").replace(/\s*|\t|\r|\n/gm, ""))
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

    const [valueButton, setValueButton] = useState('status');

    return <WrapperFilter>
        <ToggleButtonGroup>
            <ButtonsSwitches
                title={'По статусу'}
                value={'status'}
                selectedButton={valueButton}
                setSelectedButton={setValueButton}/>
            <ButtonsSwitches
                title={'По сумме'}
                value={'sum'}
                selectedButton={valueButton}
                setSelectedButton={setValueButton}/>
        </ToggleButtonGroup>
        <SelectsContainer>
            {valueButton === 'status' && <StatusFilter statusIP={statusIP} setStatusIP={setStatusIP} category={category} setCategory={setCategory} />}
            {valueButton === 'sum' && <SumFilter nameFilteredField={nameFilteredField} setNameFilteredField={setNameFilteredField} sum={sum} setSum={setSum} />}
        </SelectsContainer>
        <ButtonsContainer>
            <FilterButtons title={'Применить'} variant={"primary"} onClick={handleApply}/>
            <FilterButtons title={'Сбросить'} variant={"secondary"} onClick={handleReset}/>
        </ButtonsContainer>
    </WrapperFilter>
};

