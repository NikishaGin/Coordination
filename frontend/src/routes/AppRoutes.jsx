import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router";
import { Login } from "../pages/Login.jsx";
import { Coordination } from "../pages/Coordination.jsx";
import { Derivative } from "../pages/Derivative.jsx";
import { Client } from "../pages/Client/Client.jsx";
import { Library } from "../pages/Library.jsx";
import Layout from "./Layout.jsx";
import { resetGlobal, updateUrlHistory } from '../store/globalSlice.js';
import { useDispatch, useSelector } from "react-redux";



export const AppRoutes = ({ isAuth }) => {
    const location = useLocation()
    const dispatch = useDispatch()
    const urlHistory = useSelector((state) => state.global.urlHistory);

    useEffect(() => {
        dispatch(updateUrlHistory(location.pathname))
        if (/^\/client\/\d{7,}$/.test(urlHistory[0]) && (urlHistory[1] != location.pathname))
           dispatch(resetGlobal())
    }, [location])

    if (isAuth)
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/coordination" replace />} />
                    <Route path="*" element={<Navigate to="/coordination" replace />} />
                    <Route path="/coordination" element={<Coordination />} />
                    <Route path="/derivative" element={<Derivative />} />
                    <Route path="/coordination-archive" element={<Coordination />} />
                    <Route path="/derivative-archive" element={<Derivative />} />
                    <Route path="/library-documentation" element={<Library />} />
                    <Route path="/library-practice" element={<Library />} />
                    {/* <Route path="/directory" element={<Directory />} />
                    <Route path="/feedback" element={<Feedback />} /> */}
                </Route>
                <Route path="/client/:inn" element={<Client />} />
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

