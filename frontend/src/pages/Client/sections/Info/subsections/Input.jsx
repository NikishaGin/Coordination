import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: rgb(209, 213, 219);
  font-size: 14px;
  margin-bottom: 8px;
`;

const StyledInput = styled.input`
  background-color: rgb(30, 35, 45);
  color: rgb(255, 255, 255);
  border: 1px solid ${props => props.error ? 'rgb(239, 68, 68)' : 'rgb(75, 85, 99)'};
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  }
  
  &::placeholder {
    color: rgb(107, 114, 128);
  }
`;

const ErrorMessage = styled.span`
  color: rgb(239, 68, 68);
  font-size: 12px;
  margin-top: 4px;
`;

const Input = ({
                   label,
                   error,
                   errorMessage,
                   ...props
               }) => {
    return (
        <InputContainer>
            {label && <Label>{label}</Label>}
            <StyledInput error={error} {...props} />
            {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </InputContainer>
    );
};

export default Input;