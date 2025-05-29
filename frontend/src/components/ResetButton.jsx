import styled from 'styled-components';

const StyledResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
  background-color: transparent;
  border: 1px solid #475569;

  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  /* Применяем переданные стили */
  ${props => props.style && `
    width: ${props.style.width};
    display: ${props.style.display};
  `}


  color: #94a3b8;
  
  &:hover {
    background-color: rgba(148, 163, 184, 0.1); /* мягкий фон при наведении */
    color: #fff;
    border-color: #64748b;
  }
  
  &:active {
    background-color: hsl(0, 0%, 10%);
    border-color: hsl(0, 0%, 30%);
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 600px) {
    padding: 8px 8px;
    font-size: 0.75rem;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  margin-right: 8px;
`;

export const ResetButton = ({ icon, children, onClick, style }) => {
    return (
        <StyledResetButton onClick={onClick} style={style}>
            {icon && <IconWrapper>{icon}</IconWrapper>}
            {children}
        </StyledResetButton>
    );
};


