import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


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

export const useToken = () => useSelector(state => state.user?.token ?? null);

export const useUser = () => useSelector(state => state.user.profile);

export default userSlice.reducer;