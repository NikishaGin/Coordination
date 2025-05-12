import styled from "styled-components";
import {handlesInputInn} from "../inputs/handleInput.js"
import {setInputValueInn} from "../../store/globalSlice.js";
import { useDispatch, useSelector } from "react-redux";


// Контейнер для инпута и иконки
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  border-radius: 4px; // Скругление углов
  padding: 4px; // Внутренние отступы для контейнера
  width: 100%; // Занимает всю доступную ширину
  
  &:hover {
    transition: all 0.3s ease;
    background-color: rgba(51, 60, 77, 0.3);
  }
  
  &:focus-within {
    border-color: hsl(210, 100%, 60%); // Подсветка при фокусе на любом дочернем элементе
  }
`;

// Стиль для иконки
const Icon = styled.svg`
  width: 20px; // Размер иконки
  height: 20px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
  color: hsl(210, 100%, 60%); // Цвет иконки
  margin-right: 8px; // Отступ между иконкой и инпутом
  flex-shrink: 0; // Иконка не сжимается
`;

// Стиль для инпута
const Input = styled.input`
  width: 100%; // Занимает оставшуюся ширину
  height: 32px; // Высота инпута
  padding: 4px 8px; // Внутренние отступы
  font-size: 14px; // Размер шрифта
  color: rgb(148, 160, 184); // Цвет текста
  background-color: transparent; // Прозрачный фон
  border: none; // Убираем границу у инпута
  outline: none; // Убираем стандартное выделение при фокусе

  &::placeholder {
    color: rgba(148, 160, 184, 0.6); // Цвет placeholder'а
  }
`;

export const SearchInn = () => {
    const dispatch = useDispatch(); // Получаем функцию dispatch
    const inputValueInn = useSelector((state) => state.global.filters.inputValueInn);

    const handleChange = (event) => {
        dispatch(setInputValueInn(event.target.value)); // Обновляем значение инпута
    };

    return (
        <InputWrapper>
            <Icon
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
                data-testid="SearchIcon"
            >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path>
            </Icon>
            <Input type="text" value={inputValueInn} onChange={handleChange} onKeyPress={handlesInputInn.handleKeyPress} onPaste={handlesInputInn.handlePaste} placeholder="Поиск по ИНН" />
        </InputWrapper>
    );
};