import React, {useState} from 'react';
import styled from "styled-components";

const Container = styled.header`
  display: flex;
  align-items: center;
  height: 65px;
  background: linear-gradient(90deg,
  rgb(12, 16, 23) 0%, /* Темно-сине-черный */ 
  rgba(43, 166, 255, 0.2) 20%, /* Легкий синий акцент */ 
  rgba(25, 78, 117, 0.4) 40%, /* Глубокий синий */ 
  rgba(43, 166, 255, 0.2) 70%, /* Яркий синий */ 
  rgba(25, 78, 117, 0.2) 90%, /* Возвращение к глубокому синему */ 
  rgb(12, 16, 23) 95% /* Закрытие темным фоном */
  );
  border-width: 0px 0px 1px;
  border-style: solid;
  border-color: rgba(51, 60, 77, 0.6);
  position: relative;
  z-index: 11;
  padding-left: 12px;
`;

const Navigation = styled.ul`
  margin-left: 36px;
  list-style: none;
  display: flex;
  gap: 36px;
`;

const NavItem = styled.li`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgb(255, 255, 255);
  position: relative;
  z-index: 2;
  font-family: 'Roboto', sans-serif; // Применяем шрифт к элементам меню
`;

const NavLink = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 4px 8px;
  background: linear-gradient(90deg,
  rgba(43, 166, 255, 0.2) 0%,
  rgba(25, 78, 117, 0.4) 50%,
  rgba(43, 166, 255, 0.2) 100%);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 4px;
  color: white;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg,
    rgba(43, 166, 255, 0.4) 0%,
    rgba(25, 78, 117, 0.6) 50%,
    rgba(43, 166, 255, 0.4) 100%);
  }

  &:active {
    background: linear-gradient(90deg,
    rgba(43, 166, 255, 0.6) 0%,
    rgba(25, 78, 117, 0.8) 50%,
    rgba(43, 166, 255, 0.6) 100%);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  }
`;

const DropdownButton = styled.button`
  font-size: 0.875rem;
  font-family: 'Roboto', sans-serif;
  padding: 4px 8px;
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg,
  rgba(43, 166, 255, 0.2) 0%,
  rgba(25, 78, 117, 0.4) 50%,
  rgba(43, 166, 255, 0.2) 100%);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 4px;
  color: white;
  transition: background 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg,
    rgba(43, 166, 255, 0.4) 0%,
    rgba(25, 78, 117, 0.6) 50%,
    rgba(43, 166, 255, 0.4) 100%);
  }

  &:active {
    background: linear-gradient(90deg,
    rgba(43, 166, 255, 0.6) 0%,
    rgba(25, 78, 117, 0.8) 50%,
    rgba(43, 166, 255, 0.6) 100%);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  }
`;

const ArrowIcon = styled.svg`
  width: 16px; // Размер иконки
  height: 16px; // Размер иконки
  fill: currentColor; // Наследует цвет из свойства color
  color: rgb(148, 160, 184); // Цвет иконки
  margin-left: 8px; // Отступ от текста
  pointer-events: none; // Иконка не реагирует на клики
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 150px;
  background-color: rgb(12, 16, 23);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 4px;
  z-index: 11;
  overflow: hidden;
  margin-top: 4px;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  color: rgb(148, 160, 184);
  cursor: pointer;
  background-color: transparent;
  text-decoration: none;

  &:hover {
    background-color: rgba(51, 60, 77, 0.2);
  }
`;

export const Header = () => {
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    return (
        <Container>
            <img src="https://data.nalog.ru/css/ul2018/img/logo-footer.svg" style={{height: "50px"}}/>
            <Navigation>
                <NavItem>
                    <NavLink>Взыскание по 47 ст.</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink>Производный долг</NavLink>
                </NavItem>
                <NavItem>
                    <div
                        style={{position: "relative", display: "inline-block",}}
                        onMouseEnter={() => setIsArchiveOpen(true)}
                        onMouseLeave={() => setIsArchiveOpen(false)}
                    >
                        <DropdownButton>
                            Архив
                            <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M7 10l5 5 5-5z"/>
                            </ArrowIcon>
                        </DropdownButton>
                        {isArchiveOpen && (
                            <DropdownMenu>
                                <DropdownItem>Взыскание по 47 ст.</DropdownItem>
                                <DropdownItem>Производный долг</DropdownItem>
                            </DropdownMenu>
                        )}
                    </div>
                </NavItem>
                <NavItem>
                    <div
                        style={{position: "relative", display: "inline-block",}}
                        onMouseEnter={() => setIsLibraryOpen(true)}
                        onMouseLeave={() => setIsLibraryOpen(false)}
                    >
                        <DropdownButton>
                            Библиотека решений
                            <ArrowIcon viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                <path d="M7 10l5 5 5-5z"/>
                            </ArrowIcon>
                        </DropdownButton>
                        {isLibraryOpen && (
                            <DropdownMenu>
                                <DropdownItem>Решение 1</DropdownItem>
                                <DropdownItem>Решение 2</DropdownItem>
                            </DropdownMenu>
                        )}
                    </div>
                </NavItem>
                <NavItem>
                    <NavLink>Справочник ГМУ ФССП</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink>Обратная связь</NavLink>
                </NavItem>
            </Navigation>
        </Container>
    );
};