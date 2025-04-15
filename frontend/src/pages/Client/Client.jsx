import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import Info from "./Info.jsx"
import Actives from "./Actives.jsx"
import Hodatai from "./Hodatai.jsx"
import Tno from "./Tno.jsx"
import Details from "./Details.jsx"
import { activesAPI } from "../../api/index.js";


const Container = styled.div`
    height: calc(100vh - 65px);
    display: flex;
    flex-direction: column;
`

export const InfoBlock = styled.div`
    display: block;
    margin: 6px;
    padding: 15px;
    background-color: rgb(20, 27, 39);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`

export const Sidebar = styled.div`

`

const Back = styled.div`
    position: relative;
    width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bolder;

    &:hover {
        cursor: pointer;
    }
    
    &:hover::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 7px;
        width: 100%;
        height: 1px;
        background: currentColor;
    }

    & span {
        font-size: 35px;
    }
`

const InfoBox = styled.div`
    margin-top: 15px;
    display: flex;
    flex-direction: row;
    gap: 150px;

    & > div {

    }

    & span {
        font-weight: bolder;

    }
`

const Nav = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    gap: 10px;
`

const NavItem = styled.div`
    padding: 15px;
    background-color: ${({active}) => (active) ? "rgba(21, 101, 192, 0.3)" : "rgba(25, 118, 210, 0.1)"} ;
    border: 1px solid rgba(25, 118, 210, 0.3);
    border-radius: 10px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);

    &:hover {
        cursor: ${({active}) => (active) ? "default" : "pointer"};
    }
`



export function Client()  {
    const [info, setInfo] = useState({})
    const [nav, setNav] = useState("info")
    const { inn } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        activesAPI.getInfo(inn).then(data => setInfo(data.data)).catch(console.log)
    }, [])

    return (
        <>
            <div></div>
            <Container>
                <InfoBlock>
                    <Back onClick={() => navigate(-1)}><span>&larr;</span>&emsp;Назад</Back>
                    <h1>{info.name}</h1>
                    <InfoBox>
                        <div><span>ИНН:</span>&emsp;{info.inn}</div>
                        <div><span>Код НО:</span>&emsp;{info.kno}</div>
                        <div><span>Категория должника:</span>&emsp;{info.category}</div>
                        {(info.sosp_code) && <div><span>Код СОСП:</span>&emsp;{info.sosp_code}</div>}
                    </InfoBox>
                    <Nav>
                        <NavItem active={nav === "info"} onClick={() => setNav("info")}>Информация о должнике</NavItem>
                        <NavItem active={nav === "actives"} onClick={() => setNav("actives")}>Активы должника</NavItem>

                        <NavItem active={nav === "hodatai"} onClick={() => setNav("hodatai")}>Направление ходатайства в ГМУ</NavItem>
                        <NavItem active={nav === "tno"} onClick={() => setNav("tno")}>Примечание ТНО</NavItem>

                        <NavItem active={nav === "details"} onClick={() => setNav("details")}>Детализация индикаторов работы </NavItem>
                    </Nav>
                </InfoBlock>
                {(nav === "info") && <Info />}
                {(nav === "actives") && <Actives />}
                {(nav === "hodatai") && <Hodatai />}
                {(nav === "tno") && <Tno />}
                {(nav === "details") && <Details />}
            </Container>
        </>
    )
}