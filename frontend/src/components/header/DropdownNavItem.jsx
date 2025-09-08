import React from 'react';
import styled from "styled-components";
import {NavLink, useLocation, useNavigate} from 'react-router';

const StyledItem = styled.li`
  display: flex;
  position: relative;
  height: 100%;
  margin: 0;
  align-items: center;
`;

const DropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  font-weight: 500;
  transition: ${props => props.theme.transition.default || 'all 0.2s ease'};
  background-color: transparent;
  color: ${props => props.theme.colors.textSecondary || '#94A0B8'};
  text-decoration: none;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md || '4px'};
  
  &:hover {
    background-color: ${props => props.theme.colors.inactiveItemHover || 'rgba(255, 255, 255, 0.05)'};
  }
  
  ${({ $isOpen, theme }) => $isOpen && `
    background-color: ${theme.colors.secondary || 'rgba(25, 118, 210, 0.1)'};
    color: ${theme.colors.text || '#F5F6FA'};
  `}
`;

const Text = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ArrowIcon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
  margin-left: 8px;
  transition: transform 200ms ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 220px;
  background-color: #171722;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 
    0px 4px 6px rgba(0, 0, 0, 0.1),
    0px 1px 3px rgba(0, 0, 0, 0.06),
    0px 8px 12px rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  z-index: 1000;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transform: translateY(${({ $isVisible }) => ($isVisible ? '0' : '10px')});
  transition: opacity 200ms ease, transform 200ms ease, visibility 200ms ease;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 20px;
    width: 12px;
    height: 12px;
    background-color: #171722;
    border-left: 1px solid ${props => props.theme.colors.border};
    border-top: 1px solid ${props => props.theme.colors.border};
    transform: rotate(45deg);
  }
`;

const StyledDropdownLink = styled(NavLink)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  background-color: transparent;
  color: ${props => props.theme.colors.dropdownText || 'rgb(245, 246, 250)'};
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &:hover {
    
    background-color: ${props => props.theme.colors.dropdownHoverBg || 'rgba(255, 255, 255, 0.08)'};
    color: #ffffff;
  }
  
  &.active {
    background-color: #3a3a6a;
    color: #ffffff;
    font-weight: 600;
    
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background-color: #4a4a7a;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease, opacity 0.4s ease;
    opacity: 0;
    z-index: -1;
  }

  &:active::after {
    width: 300%;
    height: 300%;
    opacity: 0.3;
    animation: rippleFadeOut 0.6s ease forwards;
  }

  @keyframes rippleFadeOut {
    to {
      opacity: 0;
    }
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
    margin-right: 8px;
  }
`;

const DropdownNavItem = ({ title, items, isOpen, onMouseEnter, onMouseLeave }) => {

    const location = useLocation();

    const isAnyItemActive = items.some(item => location.pathname.startsWith(item.to));

    return (
        <StyledItem
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <DropdownTrigger $isOpen={isOpen || isAnyItemActive}>
                <Text>{title}</Text>
                <ArrowIcon
                    viewBox="0 0 24 24"
                    $isOpen={isOpen}
                >
                    <path d="M7 10l5 5 5-5z" />
                </ArrowIcon>
            </DropdownTrigger>

            <DropdownMenu $isVisible={isOpen}>
                {items.map((item, index) => (
                    <StyledDropdownLink key={index} to={item.to}>
                        {item.icon && (
                            <svg
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24">
                                <path d={item.icon} />
                            </svg>
                        )}
                        {item.label}
                    </StyledDropdownLink>
                ))}
            </DropdownMenu>
        </StyledItem>
    );
};

export default DropdownNavItem;