import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import {Container, Main} from "./Sidebar.jsx"




export default function() {
    const [resolutions, setResolutions] = useState({})
    const { inn } = useParams()

    useEffect(() => {
        //activesAPI.getResolutions(inn).then(data => setResolutions(data.data)).catch(console.log)
    }, [])


    return (
        <Container>
            <Main>
                
            </Main>
        </Container>
    )
}