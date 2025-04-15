import { Navigate, Route, Routes } from "react-router";
import { Login } from "../pages/Login.jsx";
import { Coordination } from "../pages/Coordination.jsx";
import { Derivative } from "../pages/Derivative.jsx";
import { Client } from "../pages/Client/Client.jsx";
import { Directory } from "../pages/Directory.jsx";
import { Feedback } from "../pages/Feedback.jsx";
import Layout from "./Layout.jsx";



export const AppRoutes = ({ isAuth }) => {

    if (isAuth)
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/coordination" replace />} />
                    <Route path="*" element={<Navigate to="/coordination" replace />} />
                    <Route path="/coordination" element={<Coordination />} />
                    <Route path="/derivative" element={<Derivative />} />
                    <Route path="/client/:inn" element={<Client />} />
                    <Route path="/directory" element={<Directory />} />
                    <Route path="/feedback" element={<Feedback />} />
                </Route>
            </Routes>
        )
    else
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        )
};

