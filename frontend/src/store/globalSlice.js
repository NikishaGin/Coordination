import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
    selectedRegion: null,
    filters: {
        inputValueInn: "",
        status_ip: "",
        category: "",
        name_filtered_field: "",
        sum: ""
    },
    urlHistory: ["", ""]
};

// Создаем slice
const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        updateUrlHistory(state, action) {
            state.urlHistory = [state.urlHistory[1], action.payload];
        },
        setSelectedRegion(state, action) {
            state.selectedRegion = action.payload;
        },
        setInputValueInn(state, action) {
            state.filters.inputValueInn = action.payload;
        },
        setFilterStatusIp(state, action) {
            state.filters.status_ip = action.payload;
        },
        setFilterCategory(state, action) {
            state.filters.category = action.payload;
        },
        setFilterSum(state, action) {
            state.filters.sum = action.payload.sum;
            state.filters.name_filtered_field = action.payload.name_filtered_field;
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
    setFilterStatusIp,
    setFilterCategory,
    setFilterSum,
    resetGlobal
} = globalSlice.actions;

export default globalSlice.reducer;