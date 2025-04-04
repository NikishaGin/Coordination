import React from 'react';
import styled from 'styled-components';

// Стиль для кнопки "Сбросить"
const ActionButton = styled.button`
  padding: 8px 16px; // Внутренние отступы
  font-size: 14px; // Размер шрифта
  color: ${({ variant }) =>
    variant === 'primary' ? 'rgb(12, 16, 23)' : 'rgb(148, 160, 184)'}; // Цвет текста
  background-color: ${({ variant }) =>
    variant === 'primary' ? 'rgb(51, 153, 255)' : 'transparent'}; // Цвет фона
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  border-radius: 4px; // Скругление углов
  cursor: pointer; // Курсор указывает на интерактивность
  transition: all 0.3s ease; // Плавный переход
  width: 100%;
  text-align: center; // Текст по центру

  &:hover {
    background-color: ${({ variant }) =>
    variant === 'primary'
        ? 'rgba(51, 153, 255, 0.8)' // Осветляем фон для primary
        : 'rgba(51, 60, 77, 0.3)'}; // Усиливаем эффект для secondary
    color: ${({ variant }) =>
    variant === 'secondary' ? 'rgba(148, 160, 184, 0.8)' : 'inherit'};
  }

  &:active {
    background-color: ${({ variant }) =>
    variant === 'primary'
        ? 'rgba(51, 153, 255, 0.6)' // Дополнительно осветляем фон для primary
        : 'rgba(51, 60, 77, 0.4)'}; // Усиливаем эффект для secondary
    border-color: ${({ variant }) =>
    variant === 'primary' ? 'rgb(51, 153, 255)' : 'rgba(51, 60, 77, 0.8)'}; // Изменяем границу
    border-style: ${({ variant }) =>
    variant === 'secondary' ? 'dashed' : 'solid'}; // Пунктирная граница для secondary
    transform: scale(0.98); // Легкий эффект "нажатия"
    color: ${({ variant }) =>
    variant === 'secondary' ? 'rgba(148, 160, 184, 0.6)' : 'inherit'}; // Осветляем текст
  }
`;

// Стиль для кнопки "Применить"
const ApplyButton = styled(ActionButton)`
  color: white; // Белый текст
  background-color: hsl(210, 100%, 30%); // Основной цвет фона
  border: 1px solid hsl(210, 100%, 40%); // Граница
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); // Легкая тень

  &:hover {
    background-color: hsl(210, 100%, 50%); // Яркий фон при наведении
    border-color: hsl(210, 100%, 60%); // Усиленная граница
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); // Усиленная тень
  }

  &:active {
    background-color: hsl(210, 100%, 20%); // Темный фон при активации
    border-color: hsl(210, 100%, 30%); // Полностью непрозрачная граница
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.2); // Внутренняя тень
  }

  &:focus {
    outline: none; // Убираем стандартное выделение при фокусе
    box-shadow: 0 0 4px rgba(51, 153, 255, 0.7); // Более заметная тень при фокусе
  }
`;

export const FilterButtons = (props) => {
    return props.title === 'Применить' ? (
        <ApplyButton onClick={props.onClick}>{props.title}</ApplyButton>
    ) : (
        <ActionButton variant={props.variant} onClick={props.onClick}>
            {props.title}
        </ActionButton>
    );
};