import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Check, X } from 'lucide-react';
import { formatDate, formatDateForInput } from "../../../../../../utils/formatData.js";
import { handlesInputNumber } from "../../../../../../utils/handleInput.js";



const CellContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;

const CellContent = styled.div`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: ${({isEditable}) => (isEditable) ? "pointer" : "text"};
    padding: 4px 8px;
    transition: background-color 0.2s ease;
    word-wrap: break-word;
    hyphens: auto;

    &:hover {
        background-color: ${({isEditable}) => (isEditable) ? "#2a2a4a" : "none"};
    }
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    background-color: #232336;
    border: 1px solid #333344;
    border-radius: 4px;
    color: #e0e0e0;
    padding: 4px 8px;
    align-items: center;
    width: 100%;
    padding-right: ${(props) => (props.visible ? "65px" : "8px")}; /* Increased space for icons */
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

`;

const IconsContainer = styled.div`
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 8px;
    z-index: 2;
    background-color: #232336;
    border-radius: 4px;
    padding: 0 4px;
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


const parseNumber = (value) => {
    const cleaned = value.replace(/\s/g, "").replace(",", ".");
    const number = parseFloat(cleaned);
    return isNaN(number) ? null : number;
};


export function EditableCell({value, onSave, type = "text", isEditable = true}) {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(formatValue(value, type));
    const [hasChanges, setHasChanges] = useState(false);
    const inputRef = useRef(null);
    const isLongText = type === "text" && value && value.length > 50;

    const adjustTextareaHeight = () => {
        if (inputRef.current && isLongText) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(100, inputRef.current.scrollHeight)}px`;
        }
    };

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












    const handleSave = () => {
        if (tempValue !== value) {
            if (type === "inn" && ![0, 10, 12].includes(tempValue.length))
                return
            if ((type === "year") && (tempValue.length > 0)) {
                const year = Number(tempValue);
                if ((year < 1901) || (2155 < year))
                    return;
            }
            if (type === "number")
                onSave(parseNumber(tempValue) || null)
            else
                onSave(tempValue || null);
        }
        setHasChanges(false);
        setEditing(false);
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


    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isLongText) {
            handleSave();
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };


    const commonHandler = (typeEvent) => {
        if (typeEvent === "change")
            return (event) => {
                const newValue = event.target.value;
                if ((type === "inn") && (!/^\d*$/.test(newValue) || (newValue.length > 12))) return
                if ((type === "year") && (!/^\d*$/.test(newValue) || (newValue.length > 4))) return
                handleChange(event)
            }
        else if (typeEvent === "keyDown")
            return (event) => {
                if (type === "number")
                    handlesInputNumber.handleKeyDown(event)
                handleKeyDown(event)
            }
        else if (typeEvent === "keyPress")
            return (event) => {
                if (type === "number")
                    handlesInputNumber.handleKeyPress(event)
            }
        else if (typeEvent === "input")
            return (event) => {
                if (type === "number")
                    handlesInputNumber.handleInput(event)
            }
        else if (typeEvent === "paste")
            return (event) => {
                if (type === "number")
                    handlesInputNumber.handlePaste(event)
            }
    }


    const handleBlur = () => {
        if (!hasChanges)
            setEditing(false);
    }


    function formatValue(val, type, forInput = false) {
        if (type === "date" && val) {
            if (forInput) {
                return formatDateForInput(val)
            } else
                return formatDate(val)
        }
        return val || "";
    }


















    if (editing)
        return (
            <CellContainer>
                <InputWrapper visible={hasChanges}>
                    <EditInput
                        ref={inputRef}
                        type={(type === "date") ? "date" : "text"}
                        value={tempValue}
                        onChange={commonHandler("change")}
                        onKeyDown={commonHandler("keyDown")}
                        onKeyPress={commonHandler("keyPress")}
                        onInput={commonHandler("input")}
                        onPaste={commonHandler("paste")}
                        onBlur={handleBlur}
                    />
                </InputWrapper>
                <IconsContainer visible={hasChanges}>
                    <IconButton variant="save" onClick={handleSave} aria-label="Сохранить">
                        <Check size={16}/>
                    </IconButton>
                    <IconButton variant="cancel" onClick={handleCancel} aria-label="Отменить">
                        <X size={16}/>
                    </IconButton>
                </IconsContainer>
            </CellContainer>
        )
    else
        return (
            <CellContent
                onDoubleClick={() => isEditable && setEditing(true)}
                isEditable={isEditable}
            >
                {formatValue(value, type) || "—"}
            </CellContent>
        );
}