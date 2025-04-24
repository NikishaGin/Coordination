import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ButtonContainer, Button } from "../../../../../../components/buttons/Button.jsx";
import { TableContainer, Tr } from "../../../../../../components/tables/Table.jsx";
import SelectFields from "./SelectFields.jsx"
import { getHeadersAndFieldsByActive } from "./settingsTable.js";



const Container = styled(TableContainer)`
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }

    & th:nth-child(1), & td:nth-child(1) {
        width: 900px;
        max-width: 900px;
    }

    & td:nth-child(1) {
        overflow: hidden; 
        text-overflow: ellipsis;

        //white-space: normal !important;
        //word-break: break-word;
    }
`


const Input = styled.input`
    width: 100%;
    padding: 3px;
    border: ${({ view }) => (view) ? "1px solid hsl(210, 100%, 30%);" : "1px solid transparent"};
    background-color: transparent;
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: white;
    text-align: center;
`


const ButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
`




export default function ({ nameActive, data }) {
    const [selectedColumn, setSelectedColumn] = useState([])
    const {headers, feilds} = getHeadersAndFieldsByActive(nameActive)
    const listHeaderName = headers.slice(1).flat()

    console.log(headers)
    console.log(feilds)

    useEffect(() => {
        console.log(feilds)
    }, [])

    return (
        <>
            <Container hHeader="350px">
                <table>
                    <thead>
                        <tr>
                            {headers[0].map(nameHeader => <th>{nameHeader}</th>)}
                            {selectedColumn.sort((a, b) => a - b).map(index => <th>{listHeaderName[index]}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <Tr>
                                {feilds[0].map(field => <td>{row[field] ?? ""}</td>)}
                                {selectedColumn.sort((a, b) => a - b).map(index => <td>{row[feilds[1][index]] ?? ""}</td>)}
                            </Tr>
                        ))}
                    </tbody>
                </table>
            </Container>
            <ButtonBox>
                <ButtonContainer>
                    <SelectFields nameActive={nameActive} selectedColumn={selectedColumn} setSelectedColumn={setSelectedColumn} />
                </ButtonContainer>
                <ButtonContainer>
                    <Button>Сбросить изменения</Button>
                    <Button>Сохранить</Button>
                </ButtonContainer>
            </ButtonBox>
        </>
    )
}