import { Outlet } from "react-router";
import { Header } from "../components/header/Header.jsx";
import { Container, HeaderContainer } from "../pages/Coordination.jsx";
import LinearColor from "../LinearColor.jsx";



export default function Layout({ includeSidebar }) {
    const LayoutContainer = includeSidebar ? Container : ({ children }) => <div>{children}</div>

    return (
        <LayoutContainer>
            <HeaderContainer>
                <Header />
                <LinearColor />
            </HeaderContainer>
            <Outlet />
        </LayoutContainer>
    );
}