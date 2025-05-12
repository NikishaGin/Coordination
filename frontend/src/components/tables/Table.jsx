import styled from "styled-components";



export const TableContainer = styled.div`
  width: 100%; 
  height: calc(100vh - 185px);
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;

  & table {
    width: auto;
    min-width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 14px;
    text-align: center;
    display: block;
  }

  & thead {
    color: rgb(255, 255, 255);
  }

  & th {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 10px;
    border-bottom: 1px solid rgba(51, 60, 77, 0.6);
    white-space: nowrap;
    background-color: rgb(12, 16, 23);
  } 

  td {
    padding: 10px;
    border-bottom: 1px solid rgba(51, 60, 77, 0.6);
    white-space: nowrap;
  }
`;


export const Tr = styled.tr`
  cursor: ${({cursor}) => cursor ? "pointer" : "default"};
  background-color: ${({ isSelected }) =>
        isSelected ? "rgba(2, 122, 242, 0.16)" : "transparent"};
  &:hover {
    background-color: ${({ isSelected }) =>
        isSelected ? "rgba(242, 162, 2, 0.16)" : "rgba(71, 83, 107, 0.2)"};
  }
`;