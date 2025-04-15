import { Header } from "../components/header/Header.jsx";
import { Container, HeaderContainer } from "../pages/Coordination.jsx";
import { Outlet } from "react-router";


export default () => (
    <Container>
        <HeaderContainer>
            <Header />
        </HeaderContainer>
        <Outlet />
    </Container>
);