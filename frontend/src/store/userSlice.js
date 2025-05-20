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
        setUserInfo: (state, action) => {
            Object.keys(state).forEach(key => {
                state[key] = action.payload[key]
            })
        },
        resetUser(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key]
            })
        }
    }
});


export const {
    setUserInfo,
    resetUser
} = userSlice.actions;

export default userSlice.reducer;