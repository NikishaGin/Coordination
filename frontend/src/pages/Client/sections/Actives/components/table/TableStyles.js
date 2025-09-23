// import styled from "styled-components";
//
// export const Container = styled.div`
//   height: calc(100vh - 350px);
//   background-color: #171722;
//   border-radius: 8px;
//   overflow: hidden;
// `;
//
// export const TableWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   overflow: auto;
//
//   &::-webkit-scrollbar {
//     width: 8px;
//     height: 8px;
//   }
//
//   &::-webkit-scrollbar-track {
//     background: #1a1a2e;
//   }
//
//   &::-webkit-scrollbar-thumb {
//     background: #2a2a4a;
//     border-radius: 4px;
//   }
// `;
//
// export const Table = styled.table`
//   min-width: 1300px;
//   width: 100%;
//   table-layout: fixed;
//   border-collapse: collapse;
//   margin-top: 10px;
//   font-size: 14px;
//
//   th:nth-child(1) {
//     width: 250px;
//   }
//
//   th:nth-child(2) {
//     width: 150px;
//   }
//
//   th:nth-child(3) {
//     width: 150px;
//   }
//
//   th:nth-child(4) {
//     width: 250px;
//   }
//
//   th:nth-child(5) {
//     width: 250px;
//   }
//
//   th:nth-child(n+6) {
//     width: 250px;
//   }
// `;
//
// export const TableHeader = styled.thead`
//   background-color: #2a2a40;
//
//   th {
//     padding: 12px 15px;
//     text-align: left;
//     color: #ffffff;
//     font-weight: 600;
//     letter-spacing: 0.5px;
//   }
// `;
//
// export const TableRow = styled.tr`
//   border-bottom: 1px solid #333;
//   transition: background-color 0.2s ease;
//
//   &:nth-child(even) {
//     background-color: #1e1e30;
//   }
//
//   &:hover {
//     background-color: #2a2a50;
//   }
// `;
//
// export const TableCell = styled.td`
//   padding: 12px 15px;
//   color: #e0e0e0;
// `;
//
// export const NumberCell = styled(TableCell)`
//   font-family: 'Inter', monospace;
//   color: #a0d0ff;
// `;
//
// export const DateCell = styled(TableCell)`
//   color: #c0c0c0;
// `;
//
// export const SelectCell = styled(TableCell)`
//   padding: 8px 12px;
// `;
//
// export const InputCell = styled(TableCell)`
//   padding: 8px 12px;
// `;


import styled from "styled-components";

export const Container = styled.div`
    background-color: #171722;
    border-radius: 4px;
    display: flex;
    flex-direction: column;  
        
    &.transport {
        & th:nth-child(1), & td:nth-child(1) { width: 40px; }
        & th:nth-child(2), & td:nth-child(2) { width: 320px; }
        & th:nth-child(3), & td:nth-child(3) { width: 220px; }
        & th:nth-child(4), & td:nth-child(4) { width: 220px; }
        & th:nth-child(5), & td:nth-child(5) { width: 170px; }
        & th:nth-child(6), & td:nth-child(6) { width: 220px; }
        & th:nth-child(n+7), & td:nth-child(n+7) { width: 250px; }
    }

    &.property, &.ground {
        & th:nth-child(1), & td:nth-child(1) { width: 40px; }
        & th:nth-child(2), & td:nth-child(2) { width: 350px; }
        & th:nth-child(3), & td:nth-child(3) { width: 150px; }
        & th:nth-child(4), & td:nth-child(4) { width: 200px; }
        & th:nth-child(5), & td:nth-child(5) { width: 350px; }
        & th:nth-child(6), & td:nth-child(6) { width: 250px; }
        & th:nth-child(7), & td:nth-child(7) { width: 150px; }
        & th:nth-child(n+8), & td:nth-child(n+8) { width: 250px; }
    }

    &.debit {
        & th:nth-child(1), & td:nth-child(1) { width: 40px; }
        & th:nth-child(2), & td:nth-child(2) { width: 220px; }
        & th:nth-child(3), & td:nth-child(3) { width: 350px; }
        & th:nth-child(4), & td:nth-child(4) { width: 350px; }
        & th:nth-child(5), & td:nth-child(5) { width: 220px; }
        & th:nth-child(6), & td:nth-child(6) { width: 220px; }
        & th:nth-child(n+7), & td:nth-child(n+7) { width: 250px; }
    }

    &.another {
        & th:nth-child(1), & td:nth-child(1) { width: 40px; }
        & th:nth-child(2), & td:nth-child(2) { width: 350px; }
        & th:nth-child(3), & td:nth-child(3) { width: 220px; }
        & th:nth-child(n+4), & td:nth-child(n+4) { width: 250px; }
    }
`;

export const TableWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .scroll-container {
        flex: 1;
        overflow: auto;
    }

    .inner-scroll {
        display: inline-block;
    }

    .virtual-table-body {
        min-width: 1300px;
    }

    .virtual-row td {
        display: table-cell;
        padding: 12px 15px;
        word-wrap: break-word;
        vertical-align: middle;
    }

    .scroll-container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    .scroll-container::-webkit-scrollbar-track {
        background: #1a1a2e;
    }

    .scroll-container::-webkit-scrollbar-thumb {
        background: #2a2a4a;
        border-radius: 4px;
    }
`;

export const TableHeader = styled.thead`
  table-layout: fixed;
  width: 100%;
  min-width: 1300px;
  z-index: 2;  
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
    
  & tr {
      table-layout: fixed;
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


