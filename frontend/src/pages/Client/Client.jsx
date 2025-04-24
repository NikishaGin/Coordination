import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { NavItem } from "../../components/buttons/Button.jsx";
import Info from "./sections/Info/Info.jsx"
import Actives from "./sections/Actives/Actives.jsx"
import Hodatai from "./sections/Hodatai.jsx"
import Tno from "./sections/Tno.jsx"
import Details from "./sections/Details.jsx"
import { useSelector } from "react-redux";
import { activesAPI } from "../../api/index.js";


// 250px
// 330px


const Container = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 330px minmax(0, 100%);
  grid-template-rows: 250px 1fr;

  & > :first-child {
    grid-column: 1 / span 2;
  }

  & > :nth-child(2):nth-last-child(1) {
    grid-column: 1 / span 2;
  }
  
`

/*
  & > :first-child:nth-last-child(2) {
    grid-row: 1;
    grid-column: 1 / -1;
    height: 250px; // Высота шапки
}

& > :nth-child(2):nth-last-child(1) {
  grid-row: 2;
  grid-column: 1 / -1;
}

& > :first-child:nth-last-child(3) {
  grid-row: 1;
  grid-column: 1 / -1;
  height: 250px; // Высота шапки
}

& > :nth-child(2):nth-last-child(2) {
  grid-row: 2;
  grid-column: 1;
  width: 330px; // Ширина второго элемента
}
*/




export const InfoBlock = styled.div`
    padding: 15px;
    border: 1px solid rgba(51, 60, 77, 0.6);
`

const Back = styled.div`
    position: relative;
    width: 105px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    font-weight: bolder;

    &:hover {
        cursor: pointer;
    }
    
    &:hover::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0px;
        width: 100%;
        height: 1px;
        background: currentColor;
    }

    & svg {
        width: 30px;
        height: 30px;
        fill: currentColor;
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


export function Client() {
    const [info, setInfo] = useState({})
    const [nav, setNav] = useState("info")
    const [isCoordination, setIsCoordination] = useState(false)
    const { inn } = useParams()
    const navigate = useNavigate()
    const urlHistory = useSelector((state) => state.global.urlHistory);


    useEffect(() => {
        activesAPI.getInfo(inn).then(data => setInfo(data.data)).catch(console.log)
        setIsCoordination(urlHistory[1] === "/coordination")
    }, [])

    return (
        <>
            <div></div>
            <Container>
                <InfoBlock>
                    <Back onClick={() => navigate(-1)}>
                        <svg viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                        &emsp;
                        Назад
                    </Back>
                    <h2>{info.name}</h2>
                    <InfoBox>
                        <div><span>ИНН:</span>&emsp;{info.inn}</div>
                        <div><span>Код НО:</span>&emsp;{info.kno}</div>
                        <div><span>Категория должника:</span>&emsp;{info.category}</div>
                        {(info.sosp_code) && <div><span>Код СОСП:</span>&emsp;{info.sosp_code}</div>}
                    </InfoBox>
                    <Nav>
                        <NavItem active={nav === "info"} onClick={() => setNav("info")}>Информация о должнике</NavItem>
                        <NavItem active={nav === "actives"} onClick={() => setNav("actives")}>Активы должника</NavItem>
                        {(isCoordination) && <NavItem active={nav === "hodatai"} onClick={() => setNav("hodatai")}>Направление ходатайства в ГМУ</NavItem>}
                        {(isCoordination) && <NavItem active={nav === "tno"} onClick={() => setNav("tno")}>Примечание ТНО</NavItem>}
                        {/* <NavItem active={nav === "details"} onClick={() => setNav("details")}>Детализация индикаторов работы </NavItem> */}
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