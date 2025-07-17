import React, {useEffect, useState} from 'react';
import {formatDate, formatNumber} from "../../../../utils/formatData.js";
import styled from "styled-components";
import {activesAPI} from "../../../../api/index.js";
import {useParams} from "react-router";
import { useSelector } from "react-redux";

const Container = styled.div`
  height: calc(100vh - 350px);
  background-color: #171722;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a2e;
  }

  &::-webkit-scrollbar-thumb {
    background: #2a2a4a;
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const TableHeader = styled.thead`
  position: sticky;
  top: 0;  
  background-color: #2a2a40;

  th {
    padding: 12px 15px;
    text-align: left;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #333;
  transition: background-color 0.2s ease;

  &:nth-child(even) {
    background-color: #1e1e30;
  }

  &:hover {
    background-color: #2a2a50;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  color: #e0e0e0;
`;

const NumberCell = styled(TableCell)`
  text-align: right;
  font-family: 'Inter', monospace;
  color: #a0d0ff;
`;

const DateCell = styled(TableCell)`
  color: #c0c0c0;
`;

export const TableResolutions = () => {

    const {inn} = useParams();
    const pageKey = useSelector((state) => state.global.pageKey);

    const [resolutions, setResolutions] = useState([])

    useEffect(() => {
        activesAPI.getResolutions(inn, pageKey).then(data => setResolutions(data.data)).catch(console.log)
    }, [])

    return (
        <Container>
            <TableWrapper>
                <Table>
                    <TableHeader>
                        <tr>
                            <th>Номер постановления по статье 47 НК РФ</th>
                            <th>Дата постановления по статье 47 НК РФ</th>
                            <th>Сумма постановления по статье 47 НК РФ, ₽</th>
                            <th>Текущий остаток постановления по статье 47 НК РФ, ₽</th>
                            <th>Номер исполнительного производства</th>
                            <th>Дата возбуждения исполнительного производства</th>
                        </tr>
                    </TableHeader>
                    <tbody>
                    {resolutions.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell>{data.resolutions_number}</TableCell>
                            <DateCell>{formatDate(data.resolutions_date)}</DateCell>
                            <NumberCell>{formatNumber(data.resolutions_sum)}</NumberCell>
                            <NumberCell>{formatNumber(data.cur_debt)}</NumberCell>
                            <TableCell>{data.exec_number}</TableCell>
                            <DateCell>{formatDate(data.exec_date)}</DateCell>
                        </TableRow>
                    ))}
                    </tbody>
                </Table>
            </TableWrapper>
        </Container>
    );
};

