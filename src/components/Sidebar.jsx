import React, { useState } from 'react';
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(51, 60, 77, 0.6);
  height: 100%;
`;

const Filters = styled.div`
  padding: 10px;
  height: 100%;
`;

// Контейнер для селекта
const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px; // Отступ между элементами
`;

// Стиль для селекта
const StyledSelect = styled.select`
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

  /* Добавляем псевдоэлемент для частичной покраски границы */
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
const ArrowIcon = styled.svg`
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

// Контейнер для инпута и иконки
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  border-radius: 4px; // Скругление углов
  padding: 4px; // Внутренние отступы для контейнера
  width: 100%; // Занимает всю доступную ширину
`;

// Стиль для иконки
const Icon = styled.svg`
  width: 20px; // Размер иконки
  height: 20px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
  color: rgb(51, 153, 255); // Цвет иконки
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

// Стиль для футера
const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between; // Размещаем текст и иконку по краям
  border-top: 1px solid rgba(51, 60, 77, 0.6);
  height: 94px;
  padding: 0 12px; // Отступы слева и справа
`;

// Стиль для контейнера ФИО и иконки
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; // Отступ между текстом и иконкой
  color: rgb(148, 160, 184); // Цвет текста
`;

// Стиль для иконки выхода
const LogoutIcon = styled.svg`
  width: 20px; // Размер иконки
  height: 20px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
  color: rgb(148, 160, 184); // Цвет иконки
  cursor: pointer; // Курсор указывает на интерактивность
  transition: color 0.3s ease; // Плавный переход при наведении

  &:hover {
    color: rgb(51, 153, 255); // Цвет иконки
  }
`;

// Стиль для контейнера кнопок
const ToggleButtonGroup = styled.div`
  display: flex;
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница вокруг всего контейнера
  border-radius: 4px; // Скругление углов
  overflow: hidden; // Убираем видимость границ внутри
  margin-bottom: 24px; // Отступ снизу
`;

// Стиль для кнопки
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
    background-color: ${({ active }) => (active ? 'rgb(51, 153, 255)' : 'rgba(51, 60, 77, 0.2)')};
  }
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

// Стиль для кнопки
const ActionButton = styled.button`
  padding: 8px 16px; // Внутренние отступы
  font-size: 14px; // Размер шрифта
  color: ${({ variant }) => (variant === 'primary' ? 'rgb(12, 16, 23)' : 'rgb(148, 160, 184)')}; // Цвет текста
  background-color: ${({ variant }) => (variant === 'primary' ? 'rgb(51, 153, 255)' : 'transparent')}; // Цвет фона
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  border-radius: 4px; // Скругление углов
  cursor: pointer; // Курсор указывает на интерактивность
  transition: all 0.3s ease; // Плавный переход
  width: 100%;
  text-align: center; // Текст по центру

  &:hover {
    background-color: ${({ variant }) => (variant === 'primary' ? 'rgb(51, 153, 255)' : 'rgba(51, 60, 77, 0.2)')};
  }
`;

const WrapperFilter = styled.div`
  padding: 10px;
  margin-top: 12px;
  border: 1px solid rgba(51, 60, 77, 0.6); // Граница
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border-radius: 4px; // Скругление углов
`;



export const Sidebar = () => {
    const [selectedButton, setSelectedButton] = useState('status');
    const [statusIP, setStatusIP] = useState('');
    const [category, setCategory] = useState('');

    const handleChange = (value) => {
        setSelectedButton(value);
    };

    const handleApply = () => {
        console.log('Применить:', { statusIP, category });
    };

    const handleReset = () => {
        setStatusIP('');
        setCategory('');
        console.log('Сбросить');
    };

    return (
        <Container>
            <Filters>
                {/* Селект */}
                <SelectWrapper>
                    <StyledSelect>
                        {/* Значение по умолчанию */}
                        <option value="" disabled selected>
                            Выберите регион
                        </option>
                        {/* Остальные опции */}
                        <option value="option1">0500</option>
                        <option value="option2">1000</option>
                        <option value="option3">1100</option>
                        <option value="option4">2900</option>
                        <option value="option5">3500</option>
                        <option value="option6">3900</option>
                        <option value="option7">4700</option>
                        <option value="option8">5100</option>
                        <option value="option9">7800</option>
                    </StyledSelect>
                    {/* Иконка стрелки */}
                    <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                        <path d="M7 10l5 5 5-5z" />
                    </ArrowIcon>
                </SelectWrapper>

                {/* Инпут */}
                <InputWrapper>
                    <Icon
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                        data-testid="SearchIcon"
                    >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path>
                    </Icon>
                    <Input type="text" placeholder="Поиск по ИНН" />
                </InputWrapper>


                <WrapperFilter>
                {/* Кнопки */}
                <ToggleButtonGroup>
                    <ToggleButton
                        active={selectedButton === 'status'}
                        onClick={() => handleChange('status')}
                    >
                        По статусу
                    </ToggleButton>
                    <ToggleButton
                        active={selectedButton === 'sum'}
                        onClick={() => handleChange('sum')}
                    >
                        По сумме
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Два селекта */}
                <SelectsContainer>
                    <SelectWrapper>
                        <StyledSelect
                            value={statusIP}
                            onChange={(e) => setStatusIP(e.target.value)}
                        >
                            <option value="" disabled selected>
                                Статуса ИП
                            </option>
                            <option value="active">Активный</option>
                            <option value="inactive">Неактивный</option>
                        </StyledSelect>
                        <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M7 10l5 5 5-5z" />
                        </ArrowIcon>
                    </SelectWrapper>
                    <SelectWrapper>
                        <StyledSelect
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="" disabled selected>
                                Категория
                            </option>
                            <option value="individual">Физическое лицо</option>
                            <option value="legal">Юридическое лицо</option>
                        </StyledSelect>
                        <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M7 10l5 5 5-5z" />
                        </ArrowIcon>
                    </SelectWrapper>
                </SelectsContainer>

                {/* Кнопки "Применить" и "Сбросить" */}
                <ButtonsContainer>
                    <ActionButton variant="primary" onClick={handleApply}>
                        Применить
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={handleReset}>
                        Сбросить
                    </ActionButton>
                </ButtonsContainer>
                </WrapperFilter>
            </Filters>
            <Footer>
                {/* Контейнер для ФИО и иконки */}
                <UserInfo>
                    Седов Никита
                    {/* Иконка выхода */}
                    <LogoutIcon
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                        onClick={() => console.log("Выход")}
                    >
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </LogoutIcon>
                </UserInfo>
            </Footer>
        </Container>
    );
};