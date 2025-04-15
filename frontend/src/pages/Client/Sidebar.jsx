import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InfoBlock } from "./Client.jsx"


export const Container = styled.div`
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
`

const SidebarStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`

const SidebarItemStyle = styled.div`
    min-width: 300px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 15px;
    box-shadow: inset -5px -5px 5px 0 rgba(255,255,255,.1), 0 0 15px rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    cursor: ${({active}) => (active) ? "default" : "pointer"};
    background-color: ${({active}) => (active) ? "rgb(31, 46, 72);" : "transparent"};
`

const MainStyle = styled.div`
    flex-grow: 1;
`



export const Sidebar = ({ sections }) => {
    const [selectedSection, setSelectedSection] = useState(sections[0])

    return (
        <InfoBlock>
            <SidebarStyle>
                {
                    sections.map(sectionName => (
                        <SidebarItemStyle 
                            active={sectionName === selectedSection} 
                            onClick={() => setSelectedSection(sectionName)}
                        >
                            {sectionName}
                        </SidebarItemStyle>
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