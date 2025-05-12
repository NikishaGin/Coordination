import React, { useState, useEffect } from "react";
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";
import {formatNumber} from "../../../../../utils/formatData.js"
import styled from "styled-components";



const Container = styled(TableContainer)`
    height: calc(100vh - 250px);
    
    & table {
        display: table;
    }
    
    & th {
        white-space: normal;
    }
`


export default function () {
    const [actives, setActives] = useState({})
    const { inn } = useParams()

    useEffect(() => {
        activesAPI.getActivesStatistics(inn).then(data => setActives(data.data)).catch(console.log)
    }, [])


    return (
        <TableContainer hHeader="270px">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Количество</th>
                        <th>Стоимость, ₽</th>
                    </tr>
                </thead>
                <tbody>
                    <Tr>
                        <td>Транспорт</td>
                        <td>{actives.transport?.count}</td>
                        <td>{formatNumber(actives.transport?.cost) ?? "-"}</td>
                    </Tr>
                    <Tr>
                        <td>Земля</td>
                        <td>{actives.ground?.count}</td>
                        <td>{formatNumber(actives.ground?.cost) ?? "-"}</td>
                    </Tr>
                    <Tr>
                        <td>Недвижимость</td>
                        <td>{actives.property?.count}</td>
                        <td>{formatNumber(actives.property?.cost) ?? "-"}</td>
                    </Tr>
                    <Tr>
                        <td>Дебиторская задолженность</td>
                        <td>{actives.debit?.count}</td>
                        <td>{formatNumber(actives.debit?.cost) ?? "-"}</td>
                    </Tr>
                    <Tr>
                        <td>Прочие активы</td>
                        <td>{actives.another?.count}</td>
                        <td>{formatNumber(actives.another?.cost) ?? "-"}</td>
                    </Tr>
                    <Tr>
                        <td></td>
                        <td></td>
                        <td>{formatNumber(actives.total_sum)}</td>
                    </Tr>
                </tbody>
            </table>
        </TableContainer>
    )
}