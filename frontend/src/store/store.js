import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice";
import userReducer from "./userSlice";


// Создаем хранилище
const store = configureStore({
    reducer: {
        global: globalReducer,
        user: userReducer
    },
});

export default store;