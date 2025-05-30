import {useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import resetStore from "../store/store.js"
import {useEffect} from "react";
import {fetchCheckServiceMode} from "../store/globalSlice.js";



const TOKEN_EXPIRE_DELTA = 30 * 1000;


const getTimeout = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        if (!payload.exp) return undefined;
        const expireTime = payload.exp * 1000;
        const now = Date.now();
        const timeout = expireTime - now - TOKEN_EXPIRE_DELTA;
        return timeout > 0 ? timeout : 0;
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

        dispatch(fetchCheckServiceMode())

        if (serviceMode && (role !== "admin")) {
            resetStore()
            window.location.reload()
            return
        }

        const timeout = getTimeout(token);
        let timeoutId
        if (timeout)
            timeoutId = setTimeout(resetStore, timeout)
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [token, serviceMode, location])
}