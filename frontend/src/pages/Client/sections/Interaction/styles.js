import styled, {keyframes} from 'styled-components';

// Colors
const primaryColor = '#1a1a2e';
const secondaryColor = '#3a3a6a';
const textColor = '#ffffff';
const errorColor = '#ff6b6b';
const lightGrayColor = '#e0e0e0';
const darkGrayColor = '#555';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main Container
export const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  color: ${textColor};
  font-family: 'Inter', sans-serif;
  //max-height: 60vh;

  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const FormContainer = styled.form`
  background-color: ${secondaryColor};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 60vh;
  overflow-y: auto;
  
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 12px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
`;

export const DateInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: ${textColor};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
    
  &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
  }  

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

export const NumericInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: ${textColor};
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: ${textColor};
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: ${textColor};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  option {
    background-color: ${secondaryColor};
    color: ${textColor};
  }
`;

export const FileUploadContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 12px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
`;

export const FileUploadLabel = styled.label`
  display: block;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  transition: background-color 0.3s;

  &:has(input:enabled):hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:has(input:disabled) {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 6px 10px;
  border-radius: 4px;
  word-break: break-all;
  font-size: 14px;

  &:has(button:disabled) {
    opacity: 0.3;
  }
`;

export const RemoveFileButton = styled.button`
  background-color: transparent;
  color: ${textColor};
  border: none;
  margin-left: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0 4px;

  &:hover {
    color: ${errorColor};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  background-color: ${secondaryColor};
  padding-top: 16px;
`;

export const SaveButton = styled.button`
  background-color: ${primaryColor};
  color: ${textColor};
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  flex: 1;

  &:hover {
    background-color: #2a2a4e;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CancelButton = styled.button`
  background-color: transparent;
  color: ${textColor};
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  flex: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: ${textColor};
  font-weight: 500;
`;

export const AddButton = styled.button`
  background-color: #3a3a6a;
  color: #ffffff;
  border: 1px solid #3a3a6a;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    background-color: #4a4a7a;
  }
`;

export const InteractionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  margin-top: 16px;
  width: 100%;
`;

export const Card = styled.div`
  background-color: ${secondaryColor};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const CardHeader = styled.div`
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-weight: 500;
    font-size: 16px;
  }
`;

export const CardBody = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const RowLabel = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.9);
`;

export const RowValue = styled.div`
  color: ${textColor};
`;

export const FileLink = styled.a`
  color: #4dadff;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-block;
  font-size: 14px;

  &:hover {
    color: #a1d2ff;
    text-decoration: underline;
  }
`;

export const EditButton = styled.button`
  background-color: transparent;
  color: ${textColor};
  padding: 4px 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const NoDataText = styled.span`
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 24px 16px;
  color: ${textColor};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  font-size: 14px;
`;