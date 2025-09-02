import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


// Начальное состояние
const initialState = {
    regionId: null,
    role: "",
    token: ""
};


// Создаем slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.regionId = payload.regionId
            state.role = payload.role
            state.token = payload.token
        },
        clearUser: () => initialState,
    }
});


export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

export const useToken = () =>
    useSelector(state => state.user?.token ?? null);

export const useUser = () =>
    useSelector(state => state.user.profile);