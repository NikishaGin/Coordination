import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: hsl(210, 100%, 30%);
  border: 1px solid hsl(210, 100%, 40%);
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  /* Применяем переданные стили */
  ${props => props.style && `
    width: ${props.style.width};
    display: ${props.style.display};
  `}

  &:hover {
    background-color: hsl(210, 100%, 50%);
    border-color: hsl(210, 100%, 60%);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: hsl(210, 100%, 20%);
    border-color: hsl(210, 100%, 30%);
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.2);
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(51, 153, 255, 0.7);
  }

  @media (max-width: 600px) {
    padding: 8px 8px;
    font-size: 0.75rem;
  }

  &:disabled {
    background-color: hsl(210, 20%, 85%);
    border-color: hsl(210, 20%, 75%);
    color: hsl(210, 10%, 40%);
    cursor: not-allowed;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    opacity: 0.8;
    pointer-events: none;
    transform: none;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: 8px;
`;

export const IconButton = ({ icon, children, onClick, style, disabled }) => {
    return (
        <StyledButton
            onClick={onClick}
            style={style}
            disabled={disabled}
        >
            {icon && <IconWrapper>{icon}</IconWrapper>}
            {children}
        </StyledButton>
    );
};

