import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%; 
  height: calc(100vh - 193px);
  border: 1px solid rgba(51, 60, 77, 0.6);
  border-radius: 8px;
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
    background-color: ${props => props.theme.colors.surface};
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
    
  .status {
    border: 1px solid ${props => props.theme.colors.border};
    color: #fff;
  }
    
  .not-executed {
    background-color: #602020;
  }
    
  .executed-with-violation {
    background-color: #946000;
  }
    
  .executed-on-time {
    background-color: #1a5336;
  }
    
  .in-search {
    background-color: #7e4e00;
  }
    
  .pledged-to-tax {
    background-color: #4a2d79;
  }
    
  .data-updated {
    background-color: #1a3b5c;
  }
`;