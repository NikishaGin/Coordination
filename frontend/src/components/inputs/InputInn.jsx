import styled from "styled-components";


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