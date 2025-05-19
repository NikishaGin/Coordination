import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props =>
    props.variant === 'primary' ? 'rgb(59, 130, 246)' :
        props.variant === 'danger' ? 'rgb(239, 68, 68)' :
            props.variant === 'success' ? 'rgb(34, 197, 94)' :
                'transparent'
};
  color: ${props =>
    props.variant === 'primary' || props.variant === 'danger' || props.variant === 'success'
        ? 'white'
        : 'rgb(156, 163, 175)'
};
  border: ${props =>
    props.variant === 'outline'
        ? '1px solid rgb(75, 85, 99)'
        : 'none'
};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    background-color: ${props =>
    props.disabled ?
        (props.variant === 'primary' ? 'rgb(59, 130, 246)' :
            props.variant === 'danger' ? 'rgb(239, 68, 68)' :
                props.variant === 'success' ? 'rgb(34, 197, 94)' :
                    'transparent') :
        (props.variant === 'primary' ? 'rgb(37, 99, 235)' :
            props.variant === 'danger' ? 'rgb(220, 38, 38)' :
                props.variant === 'success' ? 'rgb(22, 163, 74)' :
                    'rgba(75, 85, 99, 0.1)')
};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export default Button;