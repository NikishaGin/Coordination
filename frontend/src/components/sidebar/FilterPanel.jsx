import React, {useState} from 'react';
import {ButtonsSwitches} from "./ButtonsSwitches.jsx";
import styled from "styled-components";
import {CustomSelect} from "./CustomSelect.jsx";
import {FilterButtons} from "./FilterButtons.jsx";
import {StatusFilter} from "./StatusFilter.jsx";
import {SumFilter} from "./SumFilter.jsx";

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
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница вокруг всего контейнера
  border-radius: 4px; // Скругление углов
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

    const [statusIP, setStatusIP] = useState('');
    const [category, setCategory] = useState('');

    const handleApply = () => {
        console.log('Применить:', { statusIP, category });
    };

    const handleReset = () => {
        setStatusIP('');
        setCategory('');
        console.log('Сбросить');
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
            {valueButton === 'status' && <StatusFilter statusIP={statusIP} setStatusIP={setStatusIP} category={category} setCategory={setCategory}/>}
            {valueButton === 'sum' && <SumFilter statusIP={statusIP} setStatusIP={setStatusIP}/>}
        </SelectsContainer>
        <ButtonsContainer>
            <FilterButtons title={'Применить'} variant={"primary"} onClick={handleApply}/>
            <FilterButtons title={'Сбросить'} variant={"secondary"} onClick={handleReset}/>
        </ButtonsContainer>
    </WrapperFilter>
};

