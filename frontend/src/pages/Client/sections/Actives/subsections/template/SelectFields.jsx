import { useState } from "react";
import styled from "styled-components";
import { getHeadersAndFieldsByActive } from "./settingsTable.js";




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

  &:hover {
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


export default function ({ nameActive, selectedColumn, setSelectedColumn }) {
    const [openSelect, setOpenSelect] = useState(false)

    const {headers} = getHeadersAndFieldsByActive(nameActive)
    const listHeaderName = headers.slice(1).flat()

    const handleSelectColumns = indexColumns => {
        if (Array.isArray(indexColumns))            
            if (indexColumns.every(index => selectedColumn.includes(index)))
                setSelectedColumn(prevValue => prevValue.filter(index => !indexColumns.includes(index)))
            else
                setSelectedColumn(prevValue => [...new Set([...prevValue, ...indexColumns])])
        else if (selectedColumn.includes(indexColumns))
            setSelectedColumn(prevValue => prevValue.filter(index => index != indexColumns))
        else
            setSelectedColumn(prevValue => [...prevValue, indexColumns])
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
                <SelectFieldsItem onClick={() => handleSelectColumns(Array.from({ length: listHeaderName.length }, (_, i) => i))}>
                    <input type="checkbox" checked={selectedColumn.length == listHeaderName.length} />
                    <label><b>Показать все столбцы</b></label>
                </SelectFieldsItem>
                <hr />
                {headers.slice(1).map(nameHeader => {
                    if (Array.isArray(nameHeader)) {
                        const listIndexes = nameHeader.map(name => listHeaderName.indexOf(name))
                        return (
                            <>
                                <SelectFieldsItem onClick={() => handleSelectColumns(listIndexes)}>
                                    <input type="checkbox" checked={listIndexes.every(index => selectedColumn.includes(index))} />
                                    <label><b>Выбрать все столбцы группы</b></label>
                                </SelectFieldsItem>
                                {nameHeader.map(name => {
                                    const index = listHeaderName.indexOf(name)
                                    return <SelectFieldsItem section={true} onClick={() => handleSelectColumns(index)}>
                                        <input type="checkbox" checked={selectedColumn.includes(index)} />
                                        <label>{name}</label>
                                    </SelectFieldsItem>
                                })}
                            </>
                        )
                    } else {
                        const index = listHeaderName.indexOf(nameHeader)
                        return <SelectFieldsItem onClick={() => handleSelectColumns(index)}>
                            <input type="checkbox" checked={selectedColumn.includes(index)} /><label>{nameHeader}</label>
                        </SelectFieldsItem>
                    }
                })}
            </ul>
        </SelectFields>
    )
}