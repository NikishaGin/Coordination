import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Check, X } from 'lucide-react';

const CellContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px;
  background-color: #1a1a2e;
  border-radius: 6px;
  border: 1px solid #3a3a6a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 100%;
  box-sizing: border-box;
`;

const CellContent = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  word-wrap: break-word;
  hyphens: auto;

  &:hover {
    background-color: #2a2a4a;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 65px; /* Increased space for icons */
`;

const EditInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: inherit;
  color: #ffffff;
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  white-space: normal;
  text-overflow: ellipsis;
  
  &:focus {
    background-color: #2a2a4a;
    border-radius: 4px;
  }
`;

const IconsContainer = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
  background-color: #1a1a2e;
  border-radius: 4px;
  padding: 0 4px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  color: ${props => props.variant === 'save' ? '#10b981' : '#ef4444'};
  
  &:hover {
    background-color: ${props => props.variant === 'save' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
    color: ${props => props.variant === 'save' ? '#34d399' : '#f87171'};
  }
`;

export function EditableCell({ value, onSave, type = "text", isEditable = true }) {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(formatValue(value, type));
    const [hasChanges, setHasChanges] = useState(false);
    const inputRef = useRef(null);

    const isLongText = type === "text" && value && value.length > 50;

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();

            if (inputRef.current && isLongText) {
                adjustTextareaHeight();
            }
        }
    }, [editing, isLongText]);


    useEffect(() => {
        setTempValue(formatValue(value, type, true)); // for input
    }, [value, type]);


    const adjustTextareaHeight = () => {
        if (inputRef.current && isLongText) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(100, inputRef.current.scrollHeight)}px`;
        }
    };

    const handleSave = () => {
        if (tempValue !== value) {
            onSave(tempValue);
        }
        setHasChanges(false);
        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isLongText) {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setTempValue(formatValue(value, type));
        setHasChanges(false);
        setEditing(false);
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        setTempValue(newValue);
        setHasChanges(newValue !== value);

        if (isLongText) {
            adjustTextareaHeight();
        }
    };

    function formatValue(val, type, forInput = false) {
        if (type === "date" && val) {
            const date = new Date(val);

            if (isNaN(date)) return "";

            if (forInput) {
                // Для input[type="date"] — формат YYYY-MM-DD
                return date.toISOString().split('T')[0];
            } else {
                // Для отображения — формат DD.MM.YYYY
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            }
        }
        return val || "";
    }
    if (!isEditable) {
        return <span>{formatValue(value, type) || "—"}</span>;
    }

    return editing ? (
        <CellContainer>
            <InputWrapper>
                    <EditInput
                        ref={inputRef}
                        type={type}
                        value={tempValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
            </InputWrapper>
            <IconsContainer>
                <IconButton variant="save" onClick={handleSave} aria-label="Сохранить">
                    <Check size={16} />
                </IconButton>
                <IconButton variant="cancel" onClick={handleCancel} aria-label="Отменить">
                    <X size={16} />
                </IconButton>
            </IconsContainer>
        </CellContainer>
    ) : (
        <CellContent onDoubleClick={() => setEditing(true)}>
            {formatValue(value, type) || "—"}
        </CellContent>
    );
}

export default EditableCell;
