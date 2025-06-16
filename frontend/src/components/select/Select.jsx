import styled from "styled-components";
import {ChevronDown} from "lucide-react";

export const FilterGroup = styled.div`
  margin-bottom: 24px;
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 36px 10px 10px; // Добавляем отступ справа для иконки
  background-color: #232339;
  border: 1px solid #333;
  border-radius: ${props => props.theme.borderRadius.sm};
  color: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none; // Убираем стандартную стрелку браузера
  -webkit-appearance: none; // Для Safari
  -moz-appearance: none; // Для Firefox

  &:focus {
    outline: none;
    border-color: #a0a0ff;
  }

  option {
    background-color: #232339;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const CustomIcon = styled(ChevronDown)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none; // Отключаем взаимодействие с иконкой
  color: #ffffff;
  width: 20px;
  height: 20px;
`;