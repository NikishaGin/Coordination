import { Navigate, Route, Routes } from "react-router";
import { Login } from "../pages/Login.jsx";
import { Coordination } from "../pages/Coordination.jsx";
import { Derivative } from "../pages/Derivative.jsx";
import { Client } from "../pages/Client/Client.jsx";
import { Library } from "../pages/Library.jsx";
import { RegionalStatistics } from "../pages/RegionalStatistics.jsx";
import Layout from "./Layout.jsx";



export const AppRoutes = ({ isAuth }) => {

    if (isAuth) {
        return (
            <Routes>
                {/* Layout с Sidebar */}
                <Route element={<Layout includeSidebar={true} />}>
                    <Route index element={<Navigate to="/coordination" replace />} />
                    <Route path="/coordination" element={<Coordination />} />
                    <Route path="/derivative" element={<Coordination />} />
                    <Route path="/coordination-archive" element={<Coordination />} />
                    <Route path="/derivative-archive" element={<Derivative />} />
                </Route>

                {/* Layout без Sidebar */}
                <Route element={<Layout includeSidebar={false}/>}>
                    <Route path="/library-documentation" element={<Library />} />
                    <Route path="/library-practice" element={<Library />} />
                    <Route path="/statistics" element={<RegionalStatistics />} />
                </Route>

                {/* Без Layout вообще */}
                <Route path="/client/:inn" element={<Client />} />

                {/* Перенаправление */}
                <Route path="*" element={<Navigate to="/coordination" replace />} />
            </Routes>
        );
    } else {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }
};