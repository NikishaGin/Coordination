import React from 'react';
import {AppRoutes} from "./routes/AppRoutes.jsx";
import {createGlobalStyle} from "styled-components";


const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  ul {
    list-style: none;
    margin: 0; 
    padding: 0; 
  }

  li {
    display: block;
    margin: 0; 
    padding: 0;
  }

  html, body {
    height: 100%;
    //background-color: rgb(5, 7, 10);
    background-color: rgb(15, 20, 30);
    color: rgb(255, 255, 255);
    overflow: hidden;
  }
`;


function App() {
    return <>
        <GlobalStyles/>
        <AppRoutes/>
    </>
}

export default App;



