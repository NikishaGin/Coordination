import { useEffect, useState } from "react";
import { Header } from "../components/header/Header.jsx";
import {Container, HeaderContainer} from "../pages/Coordination.jsx";
import {Outlet, useLocation} from "react-router";


export const Layout = () => {
    const location = useLocation();
    const [isLoginPage, setIsLoginPage] = useState(location.pathname === "/login");

    useEffect(() => {
        setIsLoginPage(location.pathname === "/login");
    }, [location.pathname]); // Обновляем состояние при изменении пути

    return (
        <Container>
            {!isLoginPage && (
                <HeaderContainer>
                    <Header />
                </HeaderContainer>
            )}
            <Outlet />
        </Container>
    );
};


