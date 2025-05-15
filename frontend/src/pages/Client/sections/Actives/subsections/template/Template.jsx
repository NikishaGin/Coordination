import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ButtonContainer, Button } from "../../../../../../components/buttons/Button.jsx";
import { TableContainer, Tr } from "../../../../../../components/tables/Table.jsx";
import SelectFields from "./SelectFields.jsx"
import configTables from "./settingsTable.js";
import { formatNumber, formatDate, transformDateForInput } from "../../../../../../utils/formatData.js"
import Input from "../../../../../../components/inputs/Input.jsx";



const Container = styled(TableContainer)`
    height: calc(100vh - 250px - 60px);
    
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }

    & th:nth-child(2), & td:nth-child(2) {
        width: 100px;
    }


    & th:nth-child(3), & td:nth-child(3) {
        width: 110px;
    }


    & td:nth-child(1) {
        //overflow: hidden; 
        //text-overflow: ellipsis;

        //white-space: normal !important;
        //word-break: break-word;
    }
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
`




export default function ({ nameActive, data }) {
    const [formatedData, setFormatedData] = useState([])
    const [selectedColumn, setSelectedColumn] = useState([])
    const [changedValue, setChangedValue] = useState({})
    const [viewInput, setViewInput] = useState(-1)
    const tableRef = useRef(null);
    const config = configTables(nameActive)

    useEffect(() => {
        setFormatedData(data.map(row => {
            return {
                id: row.id,
                ...config.flat().reduce((obj, { field, type, editable }) => {
                    if ((type == "date") && editable)
                        return { ...obj, [field]: transformDateForInput(row[field]) }
                    else if ((type == "date") && !editable)
                        return { ...obj, [field]: formatDate(row[field]) }
                    else if (type == "number")
                        return { ...obj, [field]: formatNumber(row[field]) }
                    else
                        return { ...obj, [field]: row[field] }
                }, {})
            }
        }))
    }, [data])





    const onChangeHandler = (id, field, value) => {
        setChangedValue(prevValue => {
            return {
                ...prevValue,
                [id]: {
                    ...prevValue[id],
                    [field]: value
                }
            }
        })
    }


    const resetChange = () => {
        setChangedValue({})
        const timer = setTimeout(() => {
            tableRef.current.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }, 0)
        return () => clearTimeout(timer)
    }

    const saveChange = () => {
        console.log(changedValue)
    }


    return (
        <>
            <Container hHeader="350px" ref={tableRef}>
                <table>
                    <thead>
                        <tr>
                            {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(({ name }) => <th>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {formatedData.map((row, index) => {
                            const data = {
                                ...row,
                                ...changedValue[row.id]
                            }

                            return (
                                <Tr
                                    key={index}
                                    onMouseEnter={() => setViewInput(index)}
                                    onMouseLeave={() => setViewInput(-1)}
                                >
                                    {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(item => {
                                        if (item.editable) {
                                            return <td width={item.width}><Input type={item.type} value={data[item.field]} onChange={event => onChangeHandler(data.id, item.field, event.target.value)} options={item.options} view={viewInput === index} /></td>
                                        } else
                                            return <td width={item.width}>{data[item.field]}</td>

                                    })}
                                </Tr>
                            )
                        })}
                    </tbody>
                </table>
            </Container>
            <ButtonBox>
                <ButtonContainer>
                    <SelectFields config={config.slice(1)} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} />
                </ButtonContainer>
                <ButtonContainer>
                    <Button onClick={resetChange}>Сбросить изменения</Button>
                    <Button onClick={saveChange}>Сохранить</Button>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}