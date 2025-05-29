import styled from 'styled-components';

export const SaveButton = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #4a4a8a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #2a2a4a;
    color: #777;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const CancelButton = styled.button`
  background-color: transparent;
  color: #a0a0ff;
  padding: 12px 24px;
  border-radius: 4px;
  border: 1px solid #444460;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(160, 160, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;