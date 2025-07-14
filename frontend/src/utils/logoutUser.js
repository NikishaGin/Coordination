import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import resetStore from "../store/store.js"
import {useEffect} from "react";
import { jwtDecode } from 'jwt-decode'
import {fetchGetServiceMode} from "../store/globalSlice.js";
import { ROLES } from "../types.js";



const TOKEN_EXPIRE_DELTA = 30 * 1000;


const getTimeout = (token) => {
    try {
        const expiresAt = jwtDecode(token).exp;
        if (!expiresAt) return undefined;
        const expireTime = expiresAt * 1000;
        const now = Date.now();
        const timeout = expireTime - now - TOKEN_EXPIRE_DELTA;
        return timeout > 0 ? timeout : undefined;
    } catch (error) {
        console.log(error)
        return undefined;
    }
};


export const useLogoutUser = (isAuth) => {
    const location = useLocation()
    const dispatch = useDispatch()
    const token = useSelector((state) => state.user.token)
    const role = useSelector((state) => state.user.role)
    const serviceMode = useSelector((state) => state.global.serviceMode)

    useEffect(() => {
        if (!isAuth) return
        dispatch(fetchGetServiceMode())
        if (serviceMode && (role !== ROLES.Admin)) {
            resetStore()
            return
        }
        const timeout = getTimeout(token);
        let timeoutId
        if (timeout)
            timeoutId = setTimeout(resetStore, timeout)
        else
            resetStore()
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [token, serviceMode, location])
}