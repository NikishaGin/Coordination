import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router';
import DropdownNavItem from './DropdownNavItem';
import {Logo} from "./Logo/Logo.jsx";

const Container = styled.header`
  display: flex;
  align-items: center;
  height: 65px;
  background-color: ${props => props.theme.colors.header || '#0C1017'};
  box-shadow: ${props => props.theme.shadows.sm || '0 1px 3px rgba(0, 0, 0, 0.1)'};
  border-width: 0px 0px 1px;
  border-style: solid;
  border-color: rgba(51, 60, 77, 0.6);
  position: relative;
  z-index: 11;
  padding-left: 12px;
`;

const Navigation = styled.ul`
  width: 100%;
  height: 60%;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  font-family: 'Inter', sans-serif;
`;

const NavItem = styled(NavLink)`
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  height: 100%;
  padding: 10px 20px;
  font-weight: 500;
  transition: ${props => props.theme.transition.default || 'all 0.2s ease'};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary || '#94A0B8'};
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  
  &.active {
    background-color: ${props => props.theme.colors.secondary || 'rgba(25, 118, 210, 0.1)'};
    color: ${props => props.theme.colors.text || '#F5F6FA'};
  }

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.inactiveItemHover || 'rgba(255, 255, 255, 0.05)'};
  }
`;

export const Header = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleMouseEnter = (dropdownName) => setOpenDropdown(dropdownName);
    const handleMouseLeave = () => setOpenDropdown(null);

    const archiveItems = [
        {to: '/coordination-archive', label: 'Взыскание по 47 ст.'},
        {to: '/derivative-archive', label: 'Производный долг'},
    ];

    const libraryItems = [
        {to: '/library-documentation', label: 'Правовая документация'},
        {to: '/library-practice', label: 'Положительная практика'},
    ];

    return (
        <Container>
            <Logo />
            <Navigation>
                <NavItem to="/coordination">Взыскание по 47 ст.</NavItem>
                <NavItem to="/derivative">Производный долг</NavItem>
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
                {/*<NavItem to="/directory">Справочник ГМУ ФССП</NavItem>*/}
                {/*<NavItem to="/feedback">Обратная связь</NavItem>*/}
            </Navigation>
        </Container>
    );
};
