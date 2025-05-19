import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/userSlice.js";


const TOKEN_EXPIRE_DELTA = 30 * 1000;

export const useLogoutOnTokenExpires = (logoutCall) => {
    const dispatch = useDispatch();
    const token = useSelector(selectUser).token;

    const getTimeout = (token) => {
        try {
            const payloadBase64 = token.split('.')[1];
            console.log(payloadBase64);

            const payloadJson = atob(payloadBase64);
            console.log(payloadJson);

            const payload = JSON.parse(payloadJson);

            console.log(payload);

            if (!payload.exp) return null;

            const expireTime = payload.exp * 1000;
            const now = Date.now();
            const timeout = expireTime - now - TOKEN_EXPIRE_DELTA;

            return timeout > 0 ? timeout : 0;
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    useEffect(() => {
        let timeoutId = null;

        if (token) {
            const timeout = getTimeout(token);
            console.log(timeout);
            if (timeout !== null) {
                timeoutId = setTimeout(logoutCall, timeout);
            }
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [token, dispatch]);
};
