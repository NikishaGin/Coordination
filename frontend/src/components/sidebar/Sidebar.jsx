import React from 'react';
import styled from "styled-components";
import {SelectRegion} from "./SelectRegion.jsx";
import {SearchInn} from "./SearchInn.jsx";
import {Footer} from "./Footer.jsx";
import {FilterPanel} from "./FilterPanel.jsx";

const Container = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Wrapper = styled.div`
  padding: 10px;
  height: 100%;
`;

export const Sidebar = () => {
    return (
        <Container>
            <Wrapper>
                {/* Селект */}
                <SelectRegion/>
                {/* Инпут */}
                <SearchInn/>
                {/*Фильтрация по статусу или сумме*/}
                <FilterPanel/>
            </Wrapper>
            <Footer/>
        </Container>
    );
};