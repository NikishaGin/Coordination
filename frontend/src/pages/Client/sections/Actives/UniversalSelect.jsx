import styled from "styled-components";
import React, { memo } from 'react';

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  background-color: #232330;
  color: #e0e0e0;
  border: 1px solid #3a3a5a;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4a4a7a;
    box-shadow: 0 0 0 2px rgba(70, 70, 120, 0.3);
  }
  
  &:hover {
    background-color: #2a2a40;
  }
  
  /* Custom dropdown arrow */
  background-image: linear-gradient(45deg, transparent 50%, #a0a0c0 50%), 
                    linear-gradient(135deg, #a0a0c0 50%, transparent 50%);
  background-position: calc(100% - 16px) center, calc(100% - 10px) center;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  
  option {
    background-color: #232330;
    color: #e0e0e0;
    padding: 8px;
  }
`;

export const UniversalSelect = memo(({ value, onChange, options, placeholder, disabled }) => {
    return (
        <StyledSelect
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(({ value, text }) => (
                <option key={value} value={value}>
                    {text}
                </option>
            ))}
        </StyledSelect>
    );
})

UniversalSelect.displayName = 'UniversalSelect';
