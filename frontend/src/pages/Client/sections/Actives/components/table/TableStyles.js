import styled from "styled-components";

export const Container = styled.div`
    background-color: #171722;
    
    &.transport {
        th:nth-child(1), td:nth-child(1) { width: 40px; }
        th:nth-child(2), td:nth-child(2) { width: 320px; }
        th:nth-child(3), td:nth-child(3) { width: 220px; }
        th:nth-child(4), td:nth-child(4) { width: 220px; }
        th:nth-child(5), td:nth-child(5) { width: 170px; }
        th:nth-child(6), td:nth-child(6) { width: 220px; }
        th:nth-child(n+7), td:nth-child(n+7) { width: 275px; }
    }

    &.property, &.ground {
        th:nth-child(1), td:nth-child(1) { width: 40px; }
        th:nth-child(2), td:nth-child(2) { width: 350px; }
        th:nth-child(3), td:nth-child(3) { width: 150px; }
        th:nth-child(4), td:nth-child(4) { width: 200px; }
        th:nth-child(5), td:nth-child(5) { width: 350px; }
        th:nth-child(6), td:nth-child(6) { width: 250px; }
        th:nth-child(7), td:nth-child(7) { width: 150px; }
        th:nth-child(n+8), td:nth-child(n+8) { width: 275px; }
    }

    &.debit {
        th:nth-child(1), td:nth-child(1) { width: 40px; }
        th:nth-child(2), td:nth-child(2) { width: 220px; }
        th:nth-child(3), td:nth-child(3) { width: 350px; }
        th:nth-child(4), td:nth-child(4) { width: 350px; }
        th:nth-child(5), td:nth-child(5) { width: 220px; }
        th:nth-child(6), td:nth-child(6) { width: 220px; }
        th:nth-child(n+7), td:nth-child(n+7) { width: 275px; }
    }

    &.another {
        th:nth-child(1), td:nth-child(1) { width: 40px; }
        th:nth-child(2), td:nth-child(2) { width: 350px; }
        th:nth-child(3), td:nth-child(3) { width: 220px; }
        th:nth-child(n+4), td:nth-child(n+4) { width: 275px; }
    }
    
    & .table-container {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    & .table-container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    & .table-container::-webkit-scrollbar-track {
        background: #1a1a2e;
    }

    & .table-container::-webkit-scrollbar-thumb {
        background: #2a2a4a;
        border-radius: 4px;
    }

    & .virtual-table-body {
        width: 100%;
        height: 100%;
    }
    & .virtual-table-body::-webkit-scrollbar {
        display: none;
    }    
`;


export const TableHeader = styled.thead`
    display: table;
    table-layout: fixed;
    width: 100%;
    background-color: #2a2a40;
    border-collapse: collapse;
    font-size: 14px;

    th {
        padding: 12px 15px;
        text-align: left;
        color: #ffffff;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

`;


export const TableRow = styled.tr`
    border-bottom: 1px solid #333;
    transition: background-color 0.2s ease;
    
    & td {
        display: table-cell;
        padding: 12px 15px;
        word-wrap: break-word;
        vertical-align: middle;
    }
    
    &:nth-child(even) {
        background-color: #1e1e30;
    }

    &:hover {
        background-color: #2a2a50;
    }

    &.active {
        background-color: #027AF228;
    }
`;

export const TableCell = styled.td`
    padding: 12px 15px;
    color: #e0e0e0;
`;

export const NumberCell = styled(TableCell)`
    font-family: 'Inter', monospace;
    color: #a0d0ff;
`;

export const DateCell = styled(TableCell)`
    color: #c0c0c0;
`;

export const SelectCell = styled(TableCell)`
    padding: 8px 12px;
`;

export const InputCell = styled(TableCell)`
    padding: 8px 12px;
`;