import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import {useSelector} from "react-redux";
import { Login } from "../pages/Login.jsx";
import { Coordination } from "../pages/Coordination.jsx";
import { Directory } from "../pages/Directory.jsx";
import { Feedback } from "../pages/Feedback.jsx";
import { Layout } from "./Layout.jsx";
import { Derivative } from "../pages/Derivative.jsx";
import { userAPI } from '../api';



/*
Подправил роутеры: взависимости от того, зарегистрирован ли пользователь или нет, 
отображается страница авторизации или страницы сервиса

Добавил проверку на наличие в хранилище JWT-токена и его валидности
*/

export const AppRoutes = () => {
    const [isAuth, setIsAuth] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const token = useSelector((state) => state.user.token);




    
    useEffect(() => {
        console.log(token)
        if (token && (token.length > 0)) {
            userAPI.verifyUser(token)
                .then(data => {
                    setIsAuth(data.data.isVerify)
                    if (data.data.isVerify)
                        setTimeout(() => {
                            setIsAuth(false)
                            navigate("/login")
                        }, (data.data.exp - Date.now()) * 1000)
                })
                .catch(console.log)
        } else {
           // setIsAuth(false)
            //navigate("/login")
        }

        
    }, [token, location])






    if (isAuth)
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
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        )
};

