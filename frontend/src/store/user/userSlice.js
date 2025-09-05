import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import {UsersRole} from "../../constants.js";


export const fetchLoginUser = createAsyncThunk(
    'user/fetchLoginUser',
    async ({ login, password }) => {

    }
)

// Начальное состояние
const initialState = {
    messageAuth: '',
    regionId: null,
    role: null,
    token: null
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

export const getToken = () => useSelector(state => state.user.token ?? null);
export const getUserRole = () => useSelector(state => state.user.role);
export const getUserRegion = () => useSelector(state => state.user.regionId);

export const roleDetection = () => {
    const role = getUserRole();
    return {
        isUser: role === UsersRole.USER,
        isAdmin: role === UsersRole.ADMIN,
        isGMU: role === UsersRole.LIMITED_ADMIN_GMU,
    }
}

export default userSlice.reducer;