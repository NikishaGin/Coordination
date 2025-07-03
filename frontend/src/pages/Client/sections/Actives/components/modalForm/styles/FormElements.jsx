import styled from 'styled-components';

export const FormField = styled.div`
  margin-bottom: 8px;
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #888;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 10px 10px 36px;
  background-color: #232339;
  border: 1px solid ${props => props.error ? '#ff6b6b' : '#333'};
  border-radius: 4px;
  color: #ffffff;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #a0a0ff;
  }

  &::placeholder {
    color: #888;
  }
`;