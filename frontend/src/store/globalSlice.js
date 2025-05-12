import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
    filters: {
        selectedRegion: null, // Выбранный регион
        inputValueInn: "", // Значение инпута
    },
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
        setSelectedRegion(state, action) {
            state.filters.selectedRegion = action.payload;
        },
        setInputValueInn(state, action) {
            state.filters.inputValueInn = action.payload;
        },
        setSelectedSection(state, action) {
            state.detailInfo.section = action.payload;
        },
        setSelectedSubsection(state, action) {
            state.detailInfo.subsection = action.payload;
        },
        resetGlobal(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key]
            })
        }
    },
});

// Экспортируем действия и редьюсер
export const { 
    updateUrlHistory,
    setInputValueInn,
    setSelectedRegion,
    setSelectedSection,
    setSelectedSubsection,
    resetGlobal
} = globalSlice.actions;

export default globalSlice.reducer;