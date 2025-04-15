import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
    inputValue: "", // Значение инпута
    selectedRegion: null, // Выбранный регион
};

// Создаем slice
const globalSlice = createSlice({
    name: "global", // Имя slice
    initialState,
    reducers: {
        setInputValue(state, action) {
            state.inputValue = action.payload; // Обновляем значение инпута
        },
        setSelectedRegion(state, action) {
            state.selectedRegion = action.payload; // Обновляем выбранный регион
        },
        resetGlobal(state, action) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key]
            })
        }
    },
});

// Экспортируем действия и редьюсер
export const { setInputValue, setSelectedRegion, resetGlobal } = globalSlice.actions;
export default globalSlice.reducer;