import React, { useState } from 'react';
import { useNavigate } from "react-router";
import styled from 'styled-components';
// import { useSelector } from "react-redux";
import resetStore from "../../store/store"


// Стиль для футера
const Container = styled.footer`
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
  position: relative; // Добавляем это свойство
  font-family: Inter, 'Inter Fallback', sans-serif;
  font-weight: 500;
  line-height: 1.75;
`;

// Стиль для кнопки
const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  box-sizing: border-box;
  text-align: center;
  font-size: 1.125rem;
  box-shadow: none;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0px;
  color: rgb(255, 255, 255);
  background-color: rgb(11, 14, 20);
  width: 2.25rem;
  height: 2.25rem;
  align-self: center;
  outline: 0px;
  margin: 0px;
  text-decoration: none;
  flex: 0 0 auto;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  border: 1px solid rgb(51, 60, 77);
  padding: 0.25rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08); // Эффект при наведении
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.12); // Эффект при нажатии
    transform: scale(0.98); // Легкий эффект "нажатия"
  }
`;

// Стиль для иконки
const Icon = styled.svg`
  width: 1.5rem; // Размер иконки
  height: 1.5rem; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
`;

// Стиль для выпадающего меню
const DropdownMenu = styled.div`
  position: absolute;
  top: -115%; // Центрируем по вертикали относительно кнопки
  left: calc(100% + 8px); // Располагаем справа от кнопки с отступом
  transform: translateY(-50%); // Корректируем вертикальное положение
  background-color: rgb(12, 16, 23); // Цвет фона
  border-radius: 8px; // Скругление углов
  box-shadow: 
    0px 4px 6px rgba(255, 255, 255, 0.1), // Легкая тень
    0px 1px 3px rgba(255, 255, 255, 0.06), // Более мягкая тень
    0px 8px 12px rgba(255, 255, 255, 0.08); // Глубокая тень
  padding: 8px; // Внутренние отступы
  z-index: 1000; // Чтобы меню было поверх других элементов
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)}; // Прозрачность
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')}; // Видимость
  transform-origin: left center; // Точка трансформации для анимации
  transition: opacity 242ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 161ms cubic-bezier(0.4, 0, 0.2, 1); // Плавные переходы

  & ul {
    list-style: none;
    margin: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
`;

// Стиль для стрелки перед меню
const Arrow = styled.div`
  content: '';
  display: block;
  position: absolute;
  top: 80%; // Центрируем по вертикали
  left: 0px; // Размещаем слева от меню
  width: 10px;
  height: 10px;
  background-color: rgb(12, 16, 23); // Цвет совпадает с фоном меню
  transform: translate(-50%, -50%) rotate(45deg); // Создаём треугольник
  z-index: -1; // Стрелка должна быть под меню
`;

// Стиль для разделителя
const Divider = styled.hr`
  margin: 0;
  flex-shrink: 0;
  border-width: 0 0 thin;
  border-style: solid;
  border-color: rgba(51, 60, 77, 0.6);
`;

// Стиль для кнопок "Админка" и "Статистика"
const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start; // Выравниваем текст по левому краю
  position: relative;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  box-sizing: border-box;
  font-family: Inter, 'Inter Fallback', sans-serif;
  font-weight: 500;
  line-height: 1.45;
  min-width: 64px;
  background-color: var(--variant-textBg, transparent); // Фон кнопки
  color: rgb(245, 246, 250); // Цвет текста
  // text-transform: capitalize; // Первый символ заглавный
  font-size: 0.8125rem;
  width: 100%;
  box-shadow: none;
  height: 2.5rem;
  outline: 0px;
  margin: 0px auto;
  text-decoration: none;
  border: none;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
              color 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 8px 12px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08); // Эффект при наведении
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.12); // Эффект при нажатии
    transform: scale(0.98); // Легкий эффект "нажатия"
  }

  & svg {
    width: 1.85rem; // Размер иконки
    height: 1.85rem; // Размер иконки
    fill: currentColor; // Наследует цвет из свойства color
    margin-right: 8px; // Отступ между иконкой и текстом
  }
`;







export const Footer = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [timer, setTimer] = useState(undefined);
  const navigate = useNavigate()

  // const firstname = useSelector((state) => state.user.firstname);
  // const secondname = useSelector((state) => state.user.secondname);
  // const lastname = useSelector((state) => state.user.lastname);


  const logout = () => {
    resetStore()
    navigate("/login", { replace: true });
  }


  return (
    <Container>
      <UserInfo>
        <IconButton
          onClick={() => setIsMenuVisible(prevValue => !prevValue)}
          onMouseEnter={() => {
            clearTimeout(timer)
            setIsMenuVisible(isMenuVisible)
          }}
          onMouseLeave={() => setTimer(setTimeout(() => setIsMenuVisible(false), 500))}
        >






          <Icon
            viewBox="0 0 24 24"
            focusable="false"
            aria-hidden="true"
            data-testid="MoreVertIcon"
          >
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path>
          </Icon>
          {/* Выпадающее меню */}
          <DropdownMenu isVisible={isMenuVisible}>
            <Arrow />
            <ul>
              <li>
                <MenuButton>
                  <svg
                    className="MuiSvgIcon-root"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    data-testid="BarChartIcon"
                  >
                    <path d="M22.61 18.99l-9.08-9.08c.93-2.34.45-5.1-1.44-7C9.79.61 6.21.4 3.66 2.26L7.5 6.11 6.08 7.52 2.25 3.69C.39 6.23.6 9.82 2.9 12.11c1.86 1.86 4.57 2.35 6.89 1.48l9.11 9.11c.39.39 1.02.39 1.41 0l2.3-2.3c.4-.38.4-1.01 0-1.41zm-3 1.6l-9.46-9.46c-.61.45-1.29.72-2 .82-1.36.2-2.79-.21-3.83-1.25C3.37 9.76 2.93 8.5 3 7.26l3.09 3.09 4.24-4.24-3.09-3.09c1.24-.07 2.49.37 3.44 1.31 1.08 1.08 1.49 2.57 1.24 3.96-.12.71-.42 1.37-.88 1.96l9.45 9.45-.88.89z" />
                  </svg>
                  Сервисный режим
                </MenuButton>
              </li>
              <li>
                <MenuButton onClick={() => navigate("/statistics")}>
                  <svg viewBox="0 0 24 24">
                    <g><rect fill="none" height="24" width="24"/><g><path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z"/><rect height="5" width="2" x="7" y="12"/><rect height="10" width="2" x="15" y="7"/><rect height="3" width="2" x="11" y="14"/><rect height="2" width="2" x="11" y="10"/></g></g>
                  </svg>
                  Статистика
                </MenuButton>
              </li>
            </ul>
            <Divider />
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <MenuButton onClick={logout}>
                <svg
                  className="MuiSvgIcon-root"
                  focusable="false"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  data-testid="LogoutIcon"
                >
                  <path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"></path>
                </svg>
                Выход
              </MenuButton>
            </div>
          </DropdownMenu>
        </IconButton>
      </UserInfo>
    </Container>
  );
};