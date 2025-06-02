import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import EditableCell from "./EditableCell.jsx";
import {fetchDebit, saveDebitRow} from "../../../../store/debitSlice.js";
import {AddDebitButton} from "./AddDebitButton.jsx";

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
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
`;
const TableHeader = styled.thead`
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
  font-family: 'Inter', monospace;
  color: #a0d0ff;
`;
const DateCell = styled(TableCell)`
  color: #c0c0c0;
`;
const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 16px;
  background-color: #171722;
  border-top: 1px solid #2a2a3a;
  position: sticky;
  bottom: 0;
  z-index: 2;
`;

export default function DebitTable() {
    const dispatch = useDispatch();
    const debit = useSelector((state) => state.debit?.data) || mockData;

    const { inn } = useParams();

    const tableRef = useRef(null);

    useEffect(() => {
        if (inn) {
            dispatch(fetchDebit(inn));
        }
    }, [dispatch, inn]);

    const handleInputChange = (id, field, newValue) => {
        const current = debit.find(item => item.id === id) || {};
        let updatedRow = { ...current, [field]: newValue };
        dispatch(saveDebitRow({ inn, updatedRow }));
    };

    return (
        <>
            <Container ref={tableRef} className="table-container">
                <TableWrapper>
                    <Table>
                        <TableHeader>
                        <tr>
                            <th>ИНН дебитора</th>
                            <th>Наименование дебитора</th>
                            <th>Дата ходатайства о взыскании ДЗ</th>
                            <th>Сумма дебиторской задолженности, ₽</th>
                        </tr>
                        </TableHeader>
                        <tbody>
                        {debit.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <EditableCell
                                        value={row.debitor_inn}
                                        onSave={(newVal) => handleInputChange(row.id, 'debitor_inn', newVal)}
                                        isEditable={row.type === 'insert'}
                                        type="text"
                                    />
                                </TableCell>
                                <TableCell>
                                    <EditableCell
                                        value={row.debitor_names}
                                        onSave={(newVal) => handleInputChange(row.id, 'debitor_names', newVal)}
                                    />
                                </TableCell>
                                <DateCell>
                                    <EditableCell
                                        value={row.date}
                                        onSave={(newVal) => handleInputChange(row.id, 'date', newVal)}
                                        type="date"
                                        isEditable={true}
                                    />
                                </DateCell>
                                <NumberCell>
                                    <EditableCell
                                        value={row.total_sum}
                                        onSave={(newVal) => handleInputChange(row.id, 'total_sum', Number(newVal))}
                                    />
                                </NumberCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            </Container>
            <ButtonBox>
                <AddDebitButton titleBtn={'Добавить дебиторскую задолженность'}/>
            </ButtonBox>
        </>
    );
}
