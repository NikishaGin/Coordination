import React from 'react';
import styled from 'styled-components';
import {createGlobalStyle} from "styled-components";
import {Header} from "./components/Header.jsx";
import {Sidebar} from "./components/Sidebar.jsx";
import {Main} from "./components/Main.jsx";


const GlobalStyles = createGlobalStyle`
  /* Сброс браузерных стилей */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* Включает padding и border в ширину/высоту элемента */
  }

  ul {
    list-style: none; /* Убирает маркеры (точки, стрелки и т.д.) */
    margin: 0; /* Убирает внешние отступы */
    padding: 0; /* Убирает внутренние отступы */
  }

  li {
    display: block; /* Сбрасывает любое специфическое поведение элемента списка */
    margin: 0; /* Убирает внешние отступы */
    padding: 0; /* Убирает внутренние отступы */
  }

  html, body {
    height: 100%; /* Убедитесь, что html и body занимают всю высоту viewport */
    //background-color: rgb(5, 7, 10);
    background-color: rgb(15, 20, 30);
    color: rgb(255, 255, 255);
    overflow: hidden; /* Отключаем глобальный скролл */
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 1400px); // ограничивает вторую колонку 800px
  grid-template-rows: 65px 1fr;
  grid-template-areas:
  "header header"
  "filters main";
  height: 100vh;
`;

const HeaderContainer = styled.div`
  grid-area: header;
`;

const FiltersContainer = styled.div`
  grid-area: filters;
`;

const TablesContainer = styled.div`
  grid-area: main;
  height: calc(100vh - 65px); // Вычитаем высоту header
`;

function App() {
    return (
        <Container>
            <GlobalStyles/>
            <HeaderContainer>
                <Header/>
            </HeaderContainer>
            <FiltersContainer>
                <Sidebar/>
            </FiltersContainer>
            <TablesContainer>
                <Main/>
            </TablesContainer>
        </Container>
    );
}

export default App;

