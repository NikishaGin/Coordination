import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { UsersRole } from "../../constants.js";
import { fetchLoginUser } from "./userThunks.js";


const initialState = {
    messageAuth: '',
    regionId: null,
    role: null,
    token: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser: () => initialState,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLoginUser.pending, (state, { payload }) => {})
            .addCase(fetchLoginUser.fulfilled, (state, { payload }) => {})
            .addCase(fetchLoginUser.rejected, (state, { payload }) => {})
    }
});


export const { clearUser } = userSlice.actions;


export const getToken = () => useSelector(state => state.user.token) || null;

export const getUserRole = () => useSelector(state => state.user.role);

export const getMessageAuth = () => useSelector(state => state.user.messageAuth);

export const roleDetection = () => {
    const role = getUserRole();
    return {
        isUser: role === UsersRole.USER,
        isAdmin: role === UsersRole.ADMIN,
        isGMU: role === UsersRole.LIMITED_ADMIN_GMU,
    }
}

export default userSlice.reducer;