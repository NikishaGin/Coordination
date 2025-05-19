import { createSlice } from "@reduxjs/toolkit";


// Начальное состояние
const initialState = {
    firstname: "",
    secondname: "",
    lastname: "",
    regionCode: "",
    role: "",
    token: ""
};


// Создаем slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, { payload }) => {
            state = { ...payload };
        },
        resetUser(state) {
            state = initialState;
        }
    }
});


export const selectUser = (state) => state.user;


export const {
    setUserInfo,
    resetUser
} = userSlice.actions;

export default userSlice.reducer;