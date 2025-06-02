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

const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const str = String(value);
    const parts = str.replace(/\s/g, "").split(".");
    const int = parts[0];
    const frac = parts[1] ?? "";
    const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return frac ? `${formattedInt},${frac}` : formattedInt;
};


const parseMoney = (value) => {
    const cleaned = value.replace(/\s/g, "").replace(",", ".");
    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
};

export const MoneyInput = memo(({ value, onChange }) => {
    const [editValue, setEditValue] = useState(formatMoney(value));
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        const raw = e.target.value;
        // Оставляем только цифры и максимум одну запятую
        const cleaned = raw
            .replace(/[^\d,]/g, "")
            .replace(/^([^,]*),?(.*)$/, (_, intPart, rest) => {
                const restDigits = rest.replace(/,/g, "");
                return `${intPart}${restDigits ? "," + restDigits : ""}`;
            });

        setEditValue(cleaned);
        setIsEditing(true);
    };

    const handleSave = () => {
        const parsed = parseMoney(editValue);
        onChange?.(parsed);
        setEditValue(formatMoney(parsed));
        setIsEditing(false);
        inputRef.current?.blur();
    };

    const handleCancel = () => {
        setEditValue(formatMoney(value));
        setIsEditing(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
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

MoneyInput.displayName = "MoneyInput";

