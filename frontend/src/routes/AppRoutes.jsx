import React from 'react';
import {Route, Routes} from "react-router";
import {Login} from "../pages/Login.jsx";
import {Coordination} from "../pages/Coordination.jsx";
import {Directory} from "../pages/Directory.jsx";
import {Feedback} from "../pages/Feedback.jsx";
import {Layout} from "./Layout.jsx";
import {Derivative} from "../pages/Derivative.jsx";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="login" element={<Login />} />
                <Route index path="coordination" element={<Coordination />} />
                <Route path="derivative" element={<Derivative />} />
                <Route path="directory" element={<Directory />} />
                <Route path="feedback" element={<Feedback />} />
            </Route>
        </Routes>
    );
};

