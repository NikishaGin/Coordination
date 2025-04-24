import React from 'react';
import styled from "styled-components";
import {Footer} from "../components/sidebar/Footer.jsx";



const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid rgba(51, 60, 77, 0.6);
  height: 100%;
`;



export function Library() {


    return <>
            <Container>
                <div></div>
                <Footer/>
            </Container>
    
    </>
}