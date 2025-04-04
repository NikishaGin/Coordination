import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice"; // Путь к slice

// Создаем хранилище
const store = configureStore({
    reducer: {
        global: globalReducer, // Подключаем наш slice
    },
});

export default store;