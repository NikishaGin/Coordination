import React, {useState, useEffect, useMemo, useCallback, Suspense, lazy, memo} from 'react';
import { useNavigate } from "react-router";
import styled, {createGlobalStyle} from "styled-components";
import {TableResolutions} from "./sections/Info/TableResolutions.jsx";
import ActivesStatistics from "./sections/Info/ActivesStatistics.jsx";
import {TableRowTransport} from "./sections/Actives/TableRowTransport.jsx";
import {TableRowProperty} from "./sections/Actives/TableRowProperty.jsx";
import {TableRowDebit} from "./sections/Actives/TableRowDebit.jsx";
import {TableOtherAssets} from "./sections/Actives/TableOtherAssets.jsx";
import {tableHeadersAnother, tableHeadersDebit, tableHeadersProperty, tableHeadersTransport} from "./sections/Actives/components/table/tableHeaders.js";
// import { AddButton } from "./sections/Actives/components/modalForm/AddButton.jsx";
// import DebitForm from "./sections/Actives/components/modalForm/DebitForm.jsx";
// import OtherAssetForm from "./sections/Actives/components/modalForm/OtherAssetForm.jsx";
import InteractionResultForm from "./sections/Interaction/InteractionResultForm.jsx";
// import TnoInteractionResultForm from "./sections/Interaction/TnoInteractionResultForm.jsx";
import { useDispatch } from "react-redux";
// import { clearSelectedRows } from "../../store/active/activesSlice.js";
import { useClientId, useClientInfo } from "../../store/client/clientSlice.js";
import { ActivesType } from "../../constants.js";



const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background-color: #121212;
    color: #e0e0e0;
    font-family: 'Inter', sans-serif;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  background-color: #121212;

  & > :first-child {
    grid-column: 1 / span 2;
  }
`;

const InfoBlock = styled.div`
  padding: 24px 32px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Back = styled.div`
  position: relative;
  width: 105px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  font-weight: 500;
  color: #a0a0ff;
  transition: color 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    color: #c0c0ff;
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.3s ease-in-out;
  }

  &:hover::after {
    width: 100%;
  }

  & svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(-3px);
  }
`;

const CompanyTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
  letter-spacing: 0.5px;
`;

const InfoBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  & > div {
    padding: 8px 0;
  }

  & span {
    font-weight: 600;
    color: #a0a0ff;
  }
`;

const Nav = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
`;

const StyledNavItem = styled.div`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? '#3a3a6a' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#a0a0a0'};

  &:hover {
    cursor: pointer;
    background-color: ${props => props.active ? '#3a3a6a' : '#2a2a3a'};
  }
`;

const Sidebar = styled.div`
  background-color: #1a1a2e;
  padding: 20px 0;
  border-right: 1px solid #333;
  grid-row: 2;
  grid-column: 1;
`;

const MenuItem = styled.div`
  padding: 14px 20px;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: ${props => props.active ? '#2a2a4a' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#d0d0d0;'};

  &:hover {
    background-color: ${props => props.active ? '#3a3a6a' : '#2a2a3a'};
    cursor: pointer;
    color: #ffffff;
  }
`;

const ContentArea = styled.div`
  grid-row: 2;
  grid-column: 2;
  padding: 20px;
  background-color: #171722;
`;


const TableUniversal = lazy(() => import('./sections/Actives/TableUniversal.jsx'));



export const Client = memo(() => {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nav, setNav] = useState("info");
    const [sidebarNav, setSidebarNav] = useState("");
    const clientId = useClientId()
    const info = useClientInfo();

    useEffect(() => {
        if (!clientId)
            navigate('/coordination');
    }, [clientId])

    useEffect(() => {
        const firstSidebarItem = sidebarItems[nav]?.[0];
        if (firstSidebarItem) {
            setSidebarNav(firstSidebarItem);
        }
    }, [nav]);

    useEffect(() => {
        // if (nav === "actives")
        //     dispatch(clearSelectedRows())
    }, [nav, sidebarNav]);


    const mainNavItems = useMemo(() => [
        {key: "info", label: "Информация о должнике"},
        {key: "actives", label: "Активы должника"},
        {key: "interaction", label: "Взаимодействие"},
    ], []);

    const sidebarItems = useMemo(() => ({
        info: ["Постановления", "Статистика по активам"],
        actives: ["Транспорт", "Недвижимость", "Земельные участки", "Дебиторская задолженность", "Иные активы"],
        interaction: ["Направление ходатайства в ГМУ", "Примечание ТНО"]
    }), []);

    const contentMap = useMemo(() => ({
        info: {
            "Постановления": <TableResolutions/>,
            "Статистика по активам": <ActivesStatistics/>
        },
        actives: {
            'Транспорт': (
                <TableUniversal
                    type={ActivesType.TRANSPORT}
                    // headers={tableHeadersTransport}
                    // RowComponent={TableRowTransport}
                />
            ),
            'Недвижимость': (
                <TableUniversal
                    type={ActivesType.PROPERTY}
                    // headers={tableHeadersProperty}
                    // RowComponent={TableRowProperty}
                />
            ),
            'Земельные участки': (
                <TableUniversal
                    type={ActivesType.GROUND}
                    // headers={tableHeadersProperty}
                    // RowComponent={TableRowProperty}
                />
            ),
            'Дебиторская задолженность': (
                <TableUniversal
                    type={ActivesType.DEBIT}
                    // headers={tableHeadersDebit}
                    // RowComponent={TableRowDebit}
                    // Button={<AddButton titleBtn="Добавить дебиторскую задолженность" Form={DebitForm}/>}
                />
            ),
            "Иные активы": (
                <TableUniversal
                    type={ActivesType.OTHER}
                    // headers={tableHeadersAnother}
                    //  RowComponent={TableOtherAssets}
                    // Button={<AddButton titleBtn="Добавить иные активы" Form={OtherAssetForm}/>}
                />
            )
        },
        interaction: {
            "Направление ходатайства в ГМУ": (
                <InteractionResultForm/>
            ),
            // 'Примечание ТНО': (
            //     <TnoInteractionResultForm/>
            // )
        }
    }), []);

    const handleNavClick = useCallback((key) => {
        setNav(key);
        setSidebarNav("");
    }, []);

    const handleSidebarClick = useCallback((item) => {
        setSidebarNav(item);
    }, []);

    const handleBackClick = useCallback(() => {
        navigate(-1);
    }, [navigate]);


    const currentContent = useMemo(() => {
        return contentMap[nav]?.[sidebarNav];
    }, [nav, sidebarNav, contentMap]);


    return (
        <>
            <GlobalStyle/>
            <Container>
                <InfoBlock>
                    <Back onClick={handleBackClick}>
                        <svg viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        &emsp;
                        Назад
                    </Back>
                    <CompanyTitle>{info.name}</CompanyTitle>
                    <InfoBox>
                        <div><span>ИНН:</span>&emsp;{info.inn}</div>
                        <div><span>Код НО:</span>&emsp;{info.CodeTNO}</div>
                        <div><span>Категория должника:</span>&emsp;{info.category}</div>
                        {(info.CodeSOSP) && <div><span>Код СОСП:</span>&emsp;{info.CodeSOSP}</div>}
                    </InfoBox>
                    <Nav>
                        {mainNavItems.map(({key, label}) => (
                            <StyledNavItem
                                key={key}
                                active={nav === key}
                                onClick={() => handleNavClick(key)}
                            >
                                {label}
                            </StyledNavItem>
                        ))}
                    </Nav>
                </InfoBlock>

                <Sidebar>
                    {sidebarItems[nav]?.map(item => (
                        <MenuItem
                            key={item}
                            active={sidebarNav === item}
                            onClick={() => handleSidebarClick(item)}
                        >
                            {item}
                        </MenuItem>
                    ))}
                </Sidebar>

                <ContentArea>
                    <Suspense>
                        {currentContent}
                    </Suspense>
                </ContentArea>
            </Container>
        </>
    );
})