import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
    inputValue: "", // Значение инпута
    selectedRegion: null, // Выбранный регион
    urlHistory: ["", ""],
    detailInfo: {    // Раздел и подраздел 
        section: "",
        subsection: ""
    }
};

// Создаем slice
const globalSlice = createSlice({
    name: "global", // Имя slice
    initialState,
    reducers: {
        updateUrlHistory(state, action) {
            state.urlHistory = [state.urlHistory[1], action.payload];
        },



        setInputValue(state, action) {
            state.inputValue = action.payload;
        },
        setSelectedRegion(state, action) {
            state.selectedRegion = action.payload;
        },
        setSelectedSection(state, action) {
            state.detailInfo.section = action.payload;
        },
        setSelectedSubsection(state, action) {
            state.detailInfo.subsection = action.payload;
        },
        resetGlobal(state, action) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key]
            })
        }
    },
});

// Экспортируем действия и редьюсер
export const { 
    updateUrlHistory,
    setInputValue,
    setSelectedRegion,
    setSelectedSection,
    setSelectedSubsection,
    resetGlobal
} = globalSlice.actions;
export default globalSlice.reducer;