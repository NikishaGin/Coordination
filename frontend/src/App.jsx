import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import resetStore from "./store/store.js"
import { userAPI } from './api/index.js';
import { AppRoutes } from "./routes/AppRoutes.jsx";
import "./App.css";



export default function App() {
  const [isAuth, setIsAuth] = useState(false)
  const location = useLocation()
  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    if (token && (token.length > 0)) {
      userAPI.verifyUser()
        .then(data => {
          setIsAuth(data.data.isVerify)
          if (data.data.isVerify) {
            const expirationTime = data.data.exp * 1000 - Date.now() - 30
            setTimeout(() => {
              setIsAuth(false)
              resetStore()
            }, expirationTime)
          } else 
            resetStore()
        })
        .catch(console.log)
    } else {
      setIsAuth(false)
    }
  }, [token, location])


  return <AppRoutes isAuth={isAuth} />
}