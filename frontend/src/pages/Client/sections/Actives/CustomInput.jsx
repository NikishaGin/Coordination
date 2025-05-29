import React, { useState, useRef, useEffect, memo } from "react";

import styled from "styled-components";
import { Check, X } from "lucide-react";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;
const StyledInput = styled.input`
  width: 100%;
  background-color: #232336;
  border: 1px solid ${(props) => (props.hasIcons ? "#4a4a6a" : "#333344")};
  border-radius: 4px;
  color: #e0e0e0;
  padding: 8px 12px;
  padding-right: ${(props) => (props.hasIcons ? "68px" : "12px")};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    border-color: #5a5a8a;
    background-color: #2a2a40;
  }

  &::placeholder {
    color: #6c6c8a;
  }
`;
const IconsContainer = styled.div`
  position: absolute;
  right: 8px;
  display: flex;
  gap: 8px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
`;
const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background-color: ${(props) =>
    props.variant === "save" ? "#1e3a5f" : "#3f2a3a"};
  color: ${(props) => (props.variant === "save" ? "#a0d0ff" : "#ff9090")};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: ${(props) =>
    props.variant === "save" ? "#264b79" : "#4f3545"};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CustomInput = memo(({ value: initialValue = '', valuePlaceholder, onChange }) => {
    const [value, setValue] = useState(initialValue);
    const [originalValue, setOriginalValue] = useState(initialValue);
    const inputRef = useRef(null);

    useEffect(() => {
        setValue(initialValue);
        setOriginalValue(initialValue);
    }, [initialValue]);

    const hasChanged = value !== originalValue;
    const showIcons = hasChanged;

    const handleInputChange = (e) => {
        setValue(e.target.value);
    };

    const handleSave = () => {
        if (onChange) {
            onChange(value);
        }
        setOriginalValue(value);
    };

    const handleCancel = () => {
        setValue(originalValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    return (
        <InputWrapper>
            <StyledInput
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                hasIcons={showIcons}
                placeholder={valuePlaceholder}
            />
            <IconsContainer visible={showIcons}>
                <IconButton variant="save" onClick={handleSave} title="Сохранить">
                    <Check size={16} />
                </IconButton>
                <IconButton variant="cancel" onClick={handleCancel} title="Отменить">
                    <X size={16} />
                </IconButton>
            </IconsContainer>
        </InputWrapper>
    );
});

CustomInput.displayName = 'CustomInput';
