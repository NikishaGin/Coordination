import React, {useEffect} from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { Login } from "../pages/Login.jsx";
import { Coordination } from "../pages/Coordination.jsx";
import { Directory } from "../pages/Directory.jsx";
import { Feedback } from "../pages/Feedback.jsx";
import { Layout } from "./Layout.jsx";
import { Derivative } from "../pages/Derivative.jsx";



export const AppRoutes = ({ isAuth }) => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuth && window.location.pathname !== "/login") {
            // navigate("/login")
        }
    }, [isAuth, location]);


    if (true)
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/coordination" replace />} />
                    <Route path="*" element={<Navigate to="/coordination" replace />} />
                    <Route path="/coordination" element={<Coordination />} />
                    <Route path="/derivative" element={<Derivative />} />
                    <Route path="/directory" element={<Directory />} />
                    <Route path="/feedback" element={<Feedback />} />
                </Route>
            </Routes>
        )
    else
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        )
};

