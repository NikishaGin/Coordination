import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ButtonContainer, Button } from "../../../../../../components/buttons/Button.jsx";
import { TableContainer, Tr } from "../../../../../../components/tables/Table.jsx";
import SelectFields from "./SelectFields.jsx"
import configTables from "./settingsTable.js";
import { formatNumber, formatDate, transformDateForInput } from "../../../../../../utils/formatData.js"
import Input from "../../../../../../components/inputs/Input.jsx";



const Container = styled(TableContainer)`
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
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
    const [selectedColumn, setSelectedColumn] = useState([])
    const [viewInput, setViewInput] = useState(-1)
    const [changedValue, setChangedValue] = useState({})
    const config = configTables(nameActive)


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
    }

    const saveChange = () => {
        console.log(changedDebit)
    }


    return (
        <>
            <Container hHeader="350px">
                <table>
                    <thead>
                        <tr>
                            {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(({ name }) => <th>{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <Tr
                                key={index}
                                onMouseEnter={() => setViewInput(index)}
                                onMouseLeave={() => setViewInput(-1)}
                            >
                                {[...config[0], ...config.flat().filter(({ field }) => selectedColumn.includes(field))].map(item => {
                                    if (item.editable) {
                                        return <td width={item.width}><Input type={item.type} value={row[item.field]} options={item.options} view={viewInput === index} /></td>
                                    } else
                                        return <td width={item.width}>{row[item.field]}</td>

                                })}
                            </Tr>
                        ))}
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