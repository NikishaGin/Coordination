import React, { useState } from 'react';
import styled from "styled-components";
import { NavLink } from 'react-router';
import {StyledItem, Text} from "./Header.jsx";

const StyledNavLink = styled(NavLink)`
  cursor: pointer;
  display: flex;
  align-items: center;
  white-space: nowrap;
  height: 48px;
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


  &.active:hover {
    background-color: rgba(30, 136, 229, 0.4); // Яркий голубой фон при наведении на активную кнопку
    border-color: rgba(30, 136, 229, 0.7); // Усиленная голубая обводка
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); // Усиленная тень
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
    opacity: 0;
  }

  &:active::before {
    width: 150%;
    height: 150%;
    opacity: 0.3;
    animation: rippleFadeOut 0.6s ease forwards;
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

const ArrowIcon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
  color: rgb(148, 160, 184);
  margin-left: 8px;
  pointer-events: none;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: rgb(12, 16, 23);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;
  box-shadow: 
    0px 4px 6px rgba(0, 0, 0, 0.1),
    0px 1px 3px rgba(0, 0, 0, 0.06),
    0px 8px 12px rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  z-index: 1000;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transform: translateY(${({ isVisible }) => (isVisible ? '0' : '10px')});
  transition: opacity 200ms ease, transform 200ms ease;
`;

// Стиль для ссылок в меню
const StyledSelectLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 8px 16px;
  background-color: transparent;
  color: rgb(245, 246, 250);
  font-size: 0.875rem;
  font-weight: 500;
  // text-transform: capitalize;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease;
  text-decoration: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
    margin-right: 8px;
  }
`;

export const DropdownNavItem = ({ title, items }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    return (
        <StyledItem
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Кнопка с иконкой */}
            <StyledNavLink>
                <Text>{title}</Text>
                <ArrowIcon viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                </ArrowIcon>
            </StyledNavLink>

            {/* Выпадающее меню */}
            <DropdownMenu isVisible={isMenuOpen}>
                {items.map((item, index) => (
                    <StyledSelectLink key={index} to={item.to}>
                        {item.icon && (
                            <svg
                                className="MuiSvgIcon-root"
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24">
                            </svg>
                        )}
                        {item.label}
                    </StyledSelectLink>
                ))}
            </DropdownMenu>
        </StyledItem>
    );
};

