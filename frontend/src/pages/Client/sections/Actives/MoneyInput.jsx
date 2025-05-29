import React, { useRef, useState, memo } from "react";
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
  border: 1px solid ${props => props.hasText ? "#4a4a6a" : "#333344"};
  border-radius: 4px;
  color: #e0e0e0;
  padding: 8px 12px;
  padding-right: ${props => props.hasText ? "68px" : "12px"};
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
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: ${props => props.visible ? "auto" : "none"};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.variant === "save" ? "#1e3a5f" : "#3f2a3a"};
  color: ${props => props.variant === "save" ? "#a0d0ff" : "#ff9090"};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: ${props => props.variant === "save" ? "#264b79" : "#4f3545"};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const formatValue = (val) => {
    val = String(val ?? ""); // гарантируем, что это строка, даже если null/undefined
    let cleanValue = val.replace(/[^\d.,]/g, "");
    cleanValue = cleanValue.replace(",", ".");
    const [int, frac] = cleanValue.split(".");
    const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return frac !== undefined ? `${intFormatted},${frac}` : intFormatted;
};

export const MoneyInput = memo(({ value, onChange }) => {
    const [editValue, setEditValue] = useState(formatValue(value || ""));
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const formatted = formatValue(e.target.value);
        setEditValue(formatted);
        setIsEditing(true);
    };

    const handleSave = () => {
        if (onChange) {
            const numericValue = parseFloat(
                editValue.replace(/\s/g, "").replace(",", ".")
            );

            if (!isNaN(numericValue)) {
                onChange(numericValue); // передаём число в базу
            } else {
                onChange(""); // или null, если поле пустое
            }
        }
        setIsEditing(false);
    };


    const handleCancel = () => {
        setEditValue(formatValue(value || ""));
        setIsEditing(false);
        inputRef.current.blur();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    const hasText = editValue.trim().length > 0;

    return (
        <InputWrapper>
            <StyledInput
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                hasText={hasText}
                placeholder="Введите сумму"
            />
            <IconsContainer visible={hasText && isEditing}>
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

MoneyInput.displayName = 'MoneyInput';
