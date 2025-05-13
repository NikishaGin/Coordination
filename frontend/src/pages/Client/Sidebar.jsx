import styled from "styled-components";
import { InfoBlock } from "./Client.jsx"
import { NavItem } from "../../components/buttons/Button.jsx";


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



export const Sidebar = ({ subsections, selectedSubsection, setSelectedSubsection }) => (
    <InfoBlock>
        <SidebarStyle>
            {
                subsections.map(subsectionName => (
                    <NavItem
                        active={subsectionName === selectedSubsection}
                        onClick={() => setSelectedSubsection(subsectionName)}
                    >
                        {subsectionName}
                    </NavItem>
                ))
            }
        </SidebarStyle>
    </InfoBlock>
)


export const Main = ({ children }) => (
    <InfoBlock>
        <MainStyle>
            {children}
        </MainStyle>
    </InfoBlock>
)