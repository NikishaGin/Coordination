import React from 'react';
import styled from "styled-components";
import {SelectRegion} from "./SelectRegion.jsx";
import {SearchInn} from "./SearchInn.jsx";
import {Footer} from "./Footer.jsx";
import {FilterPanel} from "./FilterPanel.jsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(51, 60, 77, 0.6);
  height: 100%;
`;

const Wrapper = styled.div`
  padding: 10px;
  height: 100%;
`;

// Контейнер для селекта
export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px; // Отступ между элементами
`;

// Стиль для селекта
export const StyledSelect = styled.select`
  position: relative; // Для позиционирования псевдоэлемента
  width: 100%; // Занимает всю доступную ширину
  height: 40px; // Высота совпадает с заголовком
  padding: 8px 36px 8px 12px; // Внутренние отступы (справа место для иконки)
  font-size: 14px; // Размер шрифта
  color: rgb(148, 160, 184); // Цвет текста
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  border-radius: 4px; // Скругление углов
  outline: none; // Убираем стандартное выделение при фокусе
  appearance: none; // Убираем стандартную стрелку браузера
  cursor: pointer;

  &:focus {
    border-color: rgb(51, 153, 255); // Изменение цвета границы при фокусе
  }

  &::placeholder {
    color: rgba(148, 160, 184, 0.6); // Цвет placeholder'а
  }

  &::after {
    content: '';
    position: absolute;
    top: -1px; // Позиция по верхней границе
    left: -1px; // Позиция по левой границе
    width: 50%; // Покрываем только половину верхней границы
    height: 1px; // Толщина линии
    background-color: rgb(51, 153, 255); // Синий цвет
    pointer-events: none; // Чтобы псевдоэлемент не мешал взаимодействию
  }
`;

// Стиль для иконки стрелки
export const ArrowIcon = styled.svg`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 20px; // Размер иконки
  height: 20px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
  color: rgb(148, 160, 184); // Цвет иконки
  pointer-events: none; // Иконка не реагирует на клики
`;

export const Sidebar = () => {
    return (
        <Container>
            <Wrapper>
                {/* Селект */}
                <SelectRegion/>
                {/* Инпут */}
                <SearchInn/>
                {/*Фильтрация по статусу или сумме*/}
                <FilterPanel/>
            </Wrapper>
            <Footer/>
        </Container>
    );
};