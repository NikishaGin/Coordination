import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
    firstname: "",
    secondname: "",
    lastname: "",
    role: "",
    token: ""
};


// Создаем slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.firstname = action.payload.firstname;
            state.secondname = action.payload.secondname;
            state.lastname = action.payload.lastname;
            state.role = action.payload.role;
            state.token = action.payload.token;
        }
    }
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;