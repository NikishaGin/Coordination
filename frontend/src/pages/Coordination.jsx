import React from 'react';
import styled from "styled-components";
import {Sidebar} from "../components/sidebar/Sidebar.jsx";
import {Main} from "../components/main/Main.jsx";
import {useLocation} from "react-router";
import {Derivative} from "./Derivative.jsx";


export const Container = styled.div`
  display: grid;
  grid-template-columns: 320px minmax(0, 100%); // ограничивает вторую колонку 800px
  grid-template-rows: 65px 1fr;
  grid-template-areas:
  "header header"
  "filters main";
  height: 100vh;
`;

export const HeaderContainer = styled.div`
  grid-area: header;
`;

const FiltersContainer = styled.div`
  grid-area: filters;
`;

const TablesContainer = styled.div`
  grid-area: main;
  height: calc(100vh - 65px); // Вычитаем высоту header
`;


export const Coordination = () => {
    return <>
            <FiltersContainer>
                <Sidebar/>
            </FiltersContainer>
            <TablesContainer>
                <Main/>
            </TablesContainer>
        </>
};





// export const Coordination = () => {
//     const location = useLocation();
//
//     let content = null;
//
//     if (location.pathname.startsWith("/coordination")) {
//         content = <Main />;
//     } else if (location.pathname.startsWith("/derivative")) {
//         content = <Derivative />;
//     }
//
//
//
//     return (
//         <>
//             <FiltersContainer>
//                 <Sidebar />
//             </FiltersContainer>
//             <TablesContainer>
//                 {content}
//             </TablesContainer>
//         </>
//     );
// };