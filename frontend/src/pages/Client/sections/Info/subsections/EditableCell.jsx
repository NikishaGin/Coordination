import { useState, useRef, useEffect } from "react";
import { Check, X } from 'lucide-react';
import styled from "styled-components";

const CellContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(2, 122, 242, 0.8);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  min-width: 60px;
`;

const CellContent = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 55px;
`;

const EditInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  font-size: inherit;
  color: white;
  width: 100%;
  min-width: 20px;
`;

const HiddenInput = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  white-space: pre;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  min-width: 20px;
`;

const IconsContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 5px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  padding: 2px;
  border-radius: 3px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:first-child {
    color: rgba(16, 185, 129, 0.8);

    &:hover {
      color: rgb(16, 185, 129);
    }
  }

  &:last-child {
    color: rgba(239, 68, 68, 0.8);

    &:hover {
      color: rgb(239, 68, 68);
    }
  }
`;

export const EditableCell = ({value, onSave, type = "text", isEditable = true}) => {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(formatValue(value, type));
    const [inputWidth, setInputWidth] = useState("auto");
    const inputRef = useRef(null);
    const hiddenInputRef = useRef(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            updateInputWidth();
        }
    }, [editing, tempValue]);

    useEffect(() => {
        setTempValue(formatValue(value, type));
    }, [value, type]);

    const updateInputWidth = () => {
        if (hiddenInputRef.current) {
            const width = hiddenInputRef.current.offsetWidth;
            setInputWidth(`${width + 4}px`);
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
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape" && !hasChanges) {
            setTempValue(formatValue(value, type));
            setEditing(false);
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
    };

    const handleBlur = (e) => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !relatedTarget.closest('.icon-buttons')) {
            if (hasChanges) {
                e.target.focus();
            } else {
                setEditing(false);
            }
        }
    };

    function formatValue(val, type) {
        if (type === "date" && val) {
            const date = new Date(val);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
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
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    style={{ width: inputWidth }}
                />
                <HiddenInput ref={hiddenInputRef}>{tempValue || " "}</HiddenInput>
            </InputWrapper>

            <IconsContainer className="icon-buttons">
                <IconButton aria-label="Подтвердить" onClick={handleSave}>
                    <Check size={16} />
                </IconButton>
                <IconButton aria-label="Отменить" onClick={handleCancel}>
                    <X size={16} />
                </IconButton>
            </IconsContainer>
        </CellContainer>
    ) : (
        <CellContent onDoubleClick={() => setEditing(true)}>
            {formatValue(value, type) || "—"}
        </CellContent>
    );
};
