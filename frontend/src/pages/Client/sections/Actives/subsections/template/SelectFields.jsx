import { useState, useEffect } from "react";
import styled from "styled-components";



const SelectFields = styled.div`
  position: relative;
  width: 450px; 
  height: 40px;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  color: rgb(148, 160, 184);
  background-color: rgb(12, 16, 23);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 4px;
  z-index: 1000;

  & svg {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    color: rgb(148, 160, 184);
    pointer-events: none;
  }

  & ul {
    display: ${({ visible }) => visible ? "block" : "none"};
    position: absolute;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    bottom: 40px;
    left: 0;
    //padding: 7px;
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
  }
`

const SelectFieldsItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 7px;
  padding-left: ${({ section }) => section ? "40px" : "7px"};

  &:hover, &:has(input[type="checkbox"]:checked):hover {
    background-color: rgb(173, 228, 255);    
  }

  &:has(input[type="checkbox"]:checked) {
    background-color: rgb(220, 243, 255);    
  }

  & input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    border: solid white;
    border-width: 0 2px 2px 0;
    pointer-events: none;
  }

  & input[type="checkbox"]:checked {
    accent-color: rgb(2, 122, 242);

  }
`


export default function ({ config, selectedColumn, setSelectedColumn }) {
    const [openSelect, setOpenSelect] = useState(false)


    const handleSelectColumns = selectedFields => {
        if (Array.isArray(selectedFields))
            if (selectedFields.every(field => selectedColumn.includes(field)))
                setSelectedColumn(prevValue => prevValue.filter(field => !selectedFields.includes(field)))
            else
                setSelectedColumn(prevValue => [...new Set([...prevValue, ...selectedFields])])
        else if (selectedColumn.includes(selectedFields))
            setSelectedColumn(prevValue => prevValue.filter(field => field != selectedFields))
        else
            setSelectedColumn(prevValue => [...prevValue, selectedFields])
    }


    return (
        <SelectFields
            visible={openSelect}
            onMouseEnter={() => setOpenSelect(true)}
            onMouseLeave={() => setOpenSelect(false)}
        >
            <span>Показать столбцы</span>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M7 14l5-5 5 5z" />
            </svg>
            <ul>
                <SelectFieldsItem onClick={() => handleSelectColumns(config.flat().map(item => item.field))}>
                    <input type="checkbox" checked={config.flat().every(item => selectedColumn.includes(item.field))} />
                    <label><b>Показать все столбцы</b></label>
                </SelectFieldsItem>
                <hr />



                {config.map(itemGroup => {
                    if (Array.isArray(itemGroup)) {
                        return (
                            <>
                                <SelectFieldsItem onClick={() => handleSelectColumns(itemGroup.map(item => item.field))}>
                                    <input type="checkbox" checked={itemGroup.every(item => selectedColumn.includes(item.field))} />
                                    <label><b>Выбрать все столбцы группы</b></label>
                                </SelectFieldsItem>
                                {itemGroup.map(item => {
                                    return (
                                        <SelectFieldsItem section={true} onClick={() => handleSelectColumns(item.field)}>
                                            <input type="checkbox" checked={selectedColumn.includes(item.field)} />
                                            <label>{item.name}</label>
                                        </SelectFieldsItem>
                                    )
                                })}
                            </>
                        )
                    } else {
                        return (
                            <SelectFieldsItem onClick={() => handleSelectColumns(itemGroup.field)}>
                                <input type="checkbox" checked={selectedColumn.includes(itemGroup.field)} /><label>{itemGroup.name}</label>
                            </SelectFieldsItem>
                        )
                    }
                })}
            </ul>
        </SelectFields>
    )
}