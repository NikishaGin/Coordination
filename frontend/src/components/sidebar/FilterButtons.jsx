import React from 'react';
import styled from 'styled-components';

// Стиль для кнопки
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

export const FilterButtons = (props) => {
    return (
        <ActionButton variant={props.variant} onClick={props.onClick}>
            {props.title}
        </ActionButton>
    );
};