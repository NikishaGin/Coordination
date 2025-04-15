import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import {Container, Sidebar, Main} from "./Sidebar.jsx"
import { activesAPI } from "../../api/index.js";




export default function() {
    const [resolutions, setResolutions] = useState({})
    const { inn } = useParams()

    useEffect(() => {
        activesAPI.getResolutions(inn).then(data => setResolutions(data.data)).catch(console.log)
    }, [])


    return (
        <Container>
            <Sidebar sections={["Постановления", "Активы", "Дебиторская задолженность"]} />
            <Main>
                
            </Main>
        </Container>
    )
}