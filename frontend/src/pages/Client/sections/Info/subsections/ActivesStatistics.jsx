import React, { useState, useEffect } from "react";
import { TableContainer, Tr } from "../../../../../components/tables/Table.jsx";
import { useParams } from "react-router";
import { activesAPI } from "../../../../../api/index.js";



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
                        <td>{actives.transport?.cost}</td>
                    </Tr>
                    <Tr>
                        <td>Земля</td>
                        <td>{actives.ground?.count}</td>
                        <td>{actives.ground?.cost}</td>
                    </Tr>
                    <Tr>
                        <td>Недвижимость</td>
                        <td>{actives.realty?.count}</td>
                        <td>{actives.realty?.cost}</td>
                    </Tr>
                    <Tr>
                        <td>Дебиторская задолженность</td>
                        <td>{actives.debit?.count}</td>
                        <td>{actives.debit?.cost}</td>
                    </Tr>
                    <Tr>
                        <td>Прочие активы</td>
                        <td>{actives.another?.count}</td>
                        <td>{actives.another?.cost}</td>
                    </Tr>
                    <Tr>
                        <td></td>
                        <td></td>
                        <td>{actives.total_sum}</td>
                    </Tr>
                </tbody>
            </table>
        </TableContainer>
    )
}