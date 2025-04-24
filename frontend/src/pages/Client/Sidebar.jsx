import React, { useEffect } from "react";
import styled from "styled-components";
import { InfoBlock } from "./Client.jsx"
import { NavItem } from "../../components/buttons/Button.jsx";
import { setSelectedSubsection } from '../../store/globalSlice.js';
import { useDispatch, useSelector } from "react-redux";


export const Container = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 330px minmax(0, 100%);
`

const SidebarStyle = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`


const MainStyle = styled.div`
`



export const Sidebar = ({ sections }) => {
    const dispatch = useDispatch()
    const selectedSection = useSelector((state) => state.global.detailInfo.subsection);

    useEffect(() => {
        dispatch(setSelectedSubsection(sections[0]))
    }, [])


    return (
        <InfoBlock>
            <SidebarStyle>
                {
                    sections.map(sectionName => (
                        <NavItem
                            active={sectionName === selectedSection}
                            onClick={() => dispatch(setSelectedSubsection(sectionName))}
                        >
                            {sectionName}
                        </NavItem>
                    ))
                }
            </SidebarStyle>
        </InfoBlock>
    )
}


export const Main = ({ children }) => (
    <InfoBlock>
        <MainStyle>
            {children}
        </MainStyle>
    </InfoBlock>
)