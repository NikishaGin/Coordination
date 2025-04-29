import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";
import {formatNumber, formatDate} from "../../../../../utils/formatData.js"


const Container = styled(TableContainer)`
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }
`


export default function () {
    const [resolutions, setResolutions] = useState([])
    const { inn } = useParams()

    useEffect(() => {
        activesAPI.getResolutions(inn).then(data => setResolutions(data.data)).catch(console.log)
    }, [])


    return (
        <Container hHeader="285px">
            <table>
                <thead>
                    <tr>
                        <th>Номер постановления по статье 47 НК РФ</th>
                        <th>Дата постановления по статье 47 НК РФ</th>
                        <th>Сумма постановления по статье 47 НК РФ, ₽</th>
                        <th>Текущий остаток постановления по статье 47 НК РФ, ₽</th>
                        <th>Номер исполнительного производства</th>
                        <th>Дата возбуждения исполнительного производства</th>
                        {/* <th>Взыскано, ₽</th> */}
                    </tr>
                </thead>
                <tbody>
                    {resolutions.map(data => (
                        <Tr>
                            <td>{data.resolutions_number}</td>
                            <td>{formatDate(data.resolutions_date)}</td>
                            <td>{formatNumber(data.resolutions_sum)}</td>
                            <td>{formatNumber(data.cur_debt)}</td>
                            <td>{data.exec_number}</td>
                            <td>{formatDate(data.exec_date)}</td>
                            {/* <td></td> */}
                        </Tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}