import React from 'react';
import styled from "styled-components";

const ToggleButton = styled.button`
  flex: 1; // Кнопки занимают равное пространство
  padding: 8px 16px; // Внутренние отступы
  font-size: 14px; // Размер шрифта
  color: ${({ active }) => (active ? 'rgb(12, 16, 23)' : 'rgb(148, 160, 184)')}; // Цвет текста
  background-color: ${({ active }) => (active ? 'rgb(51, 153, 255)' : 'transparent')}; // Цвет фона
  border: none; // Убираем границы
  cursor: pointer; // Курсор указывает на интерактивность
  transition: all 0.3s ease; // Плавный переход

  &:first-child {
    border-right: ${({ active }) => (active ? 'none' : '1px solid rgba(51, 60, 77, 0.6)')}; // Вертикальная полоска
  }

  &:hover {
    background-color: ${({ active }) => (active ? 'rgba(51, 153, 255, 0.8)' : 'rgba(51, 60, 77, 0.2)')};
  }

  &:active {
    background-color: ${({ active }) => (active ? 'rgba(51, 153, 255, 0.6)' : 'rgba(51, 60, 77, 0.4)')};
    transform: scale(0.98); // Легкий эффект "нажатия"
  }
`;

export const ButtonsSwitches = (props) => {

    const isActive = props.selectedButton === props.value;

    const handleChange = (value) => props.setSelectedButton(value);

    return <ToggleButton active={isActive}
        onClick={() => handleChange(props.value)}
    >
        {props.title}
    </ToggleButton>
};

