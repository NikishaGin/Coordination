import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { UsersRole } from "../../constants.js";
import { thunkLoginUser, thunkToggleServiceMode } from "./userThunks.js";


export const fetchLoginUser = createAsyncThunk(
    'user/fetchLoginUser',
    thunkLoginUser
);

export const fetchToggleServiceMode = createAsyncThunk(
    'user/fetchToggleServiceMode',
    thunkToggleServiceMode
);


const initialState = {
    messageAuth: '',
    serviceMode: false,
    userId: null,
    role: null,
    token: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateServiceMode(state, { payload }) {
            state.serviceMode = payload;
        },
        clearUser: () => initialState,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchLoginUser.fulfilled, (state, { payload }) => {
                state.userId = payload.user.userId;
                state.role = payload.user.role;
                state.token = payload.token;
                state.messageAuth = '';
            })
            .addCase(fetchLoginUser.rejected, (state, { error }) => {
                if (state.serviceMode)
                    state.messageAuth = error.message;
            })
            .addCase(fetchToggleServiceMode.fulfilled, (state) => {
                state.serviceMode = !state.serviceMode;
            })
    }
});


export const { clearUser, updateServiceMode } = userSlice.actions;


export const useToken = () => useSelector(state => state.user.token) || null;

export const useMessageAuth = () => useSelector(state => state.user.messageAuth);

export const useServiceMode = () => useSelector(state => state.user.serviceMode);

export const useRoleDetection = () => {
    const role = useSelector(state => state.user.role);
    return {
        isUser: role === UsersRole.USER,
        isAdmin: role === UsersRole.ADMIN,
        isGMU: role === UsersRole.LIMITED_ADMIN_GMU,
    }
}

export default userSlice.reducer;