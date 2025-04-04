import React, { useState } from 'react';
import styled from "styled-components";
import {Logo} from "./Logo.jsx";
import {NavItem} from "./NavItem.jsx";
import {DropdownNavItem} from "./DropdownNavItem.jsx";
import {NavLink} from "react-router";

const Container = styled.header`
  display: flex;
  align-items: center;
  height: 65px;
  background-color: rgb(12, 16, 23); // Фон совпадает с заголовком
  border-width: 0px 0px 1px;
  border-style: solid;
  border-color: rgba(51, 60, 77, 0.6);
  position: relative;
  z-index: 11;
  padding-left: 12px;
`;

const Navigation = styled.ul`
  width: 100%;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
`;

// Общие стили
export const StyledItem = styled.li`
  display: flex;
  position: relative;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  color: #fff;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
`;

export const StyledNavLink = styled(NavLink)`
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 8px 16px;
  text-decoration: none;
  color: #fff;
  border-radius: 4px;
  position: relative;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Базовый стиль */
  background-color: rgba(25, 118, 210, 0.1);
  border: 1px solid rgba(25, 118, 210, 0.3);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgba(30, 136, 229, 0.2);
    border-color: rgba(30, 136, 229, 0.5);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: rgba(21, 101, 192, 0.3);
    border-color: rgba(21, 101, 192, 0.6);
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.2);
  }
  &.active {
    background-color: rgba(21, 101, 192, 0.3); // Тёмно-голубой фон для активной кнопки
    color: #fff; // Белый цвет текста
    font-weight: 500;
    border-color: rgba(21, 101, 192, 0.6); // Усиленная тёмно-голубая обводка
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); // Усиленная тень
  }

  &.active:hover {
    background-color: rgba(30, 136, 229, 0.4); // Яркий голубой фон при наведении на активную кнопку
    border-color: rgba(30, 136, 229, 0.7); // Усиленная голубая обводка
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); // Усиленная тень
  }
  
  @keyframes rippleFadeOut {
    to {
      opacity: 0;
    }
  }

  /* Адаптивное поведение для маленьких экранов */
  @media (max-width: 600px) {
    padding: 8px 8px; // Уменьшаем отступы
    font-size: 0.75rem; // Уменьшаем размер шрифта
  }
`;

export const Text = styled.span`
  font-size: 0.875rem; // Уменьшенный размер шрифта
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.00938em;
  color: inherit;

  /* Адаптивный размер шрифта */
  @media (max-width: 600px) {
    font-size: 0.75rem; // Еще меньше на маленьких экранах
  }

  /* Обрезка текста с многоточием */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; // Ограничение ширины текста
`;

export const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleMouseEnter = (dropdownName) => setOpenDropdown(dropdownName);
    const handleMouseLeave = () => setOpenDropdown(null);

    const archiveItems = [
        { to: '/coordination', label: 'Взыскание по 47 ст.' },
        { to: '/derivative', label: 'Производный долг' },
    ];

    const libraryItems = [
        { to: '/library1', label: 'Правовая документация' },
        { to: '/library2', label: 'Положительная практика' },
    ];

    return (
        <Container>
            <Logo/>
            <Navigation>
                <NavItem path={'coordination'} title={'Взыскание по 47 ст.'}/>
                <NavItem path={'derivative'} title={'Производный долг'}/>

                {/* Контейнер для кнопки и выпадающего меню */}
                <DropdownNavItem
                    title="Архив"
                    items={archiveItems}
                    isOpen={openDropdown === 'archive'}
                    onMouseEnter={() => handleMouseEnter('archive')}
                    onMouseLeave={handleMouseLeave}
                />

                <DropdownNavItem
                    title="Библиотека решений"
                    items={libraryItems}
                    isOpen={openDropdown === 'library'}
                    onMouseEnter={() => handleMouseEnter('library')}
                    onMouseLeave={handleMouseLeave}
                />

                <NavItem path={'directory'} title={'Справочник ГМУ ФССП'}/>
                <NavItem path={'feedback'} title={'Обратная связь'}/>
            </Navigation>
        </Container>
    );
};