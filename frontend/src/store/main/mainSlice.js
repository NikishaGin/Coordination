import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { activesAPI, serviceAPI, userAPI } from "../../api/index.js";
import {MainAPI} from "../API.js";
import axios from "axios";




// Начальное состояние
const initialState = {
    isDerived: false,
    isArchived: false,
    allRegions: [],
    allClientCategories: [],
    allStatusesIP: [],
    selectedRegionByPage: {},
    clients: [],
    isLoading: false,
    filters: {
        inputValueInn: "",
        statusIP: "",
        category: "",
        name_filtered_field: "",
        sum: ""
    }
};





// Создаем slice
const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        recognitionPage(state, { payload }) {
            state.isArchived = ["/coordination-archive", "/coordination"].includes(payload);
            state.isDerived = ["/derivative-archive", "/derivative"].includes(payload);
        },











        setPageKey(state, action) {
            state.pageKey = action.payload;
        },
        setSelectedRegionForPage(state, action) {
            const { pageKey, regionCode } = action.payload;
            state.selectedRegionByPage[pageKey] = regionCode;
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
                state[key] = initialState[key];
            });
        }




    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetRegions.fulfilled, (state, action) => {
                state.regions = action.payload;
            })
            .addCase(fetchGetDebitTypes.fulfilled, (state, action) => {
                state.debitTypes = action.payload;
            })
            .addCase(fetchGetServiceMode.fulfilled, (state, action) => {
                state.serviceMode = action.payload;
            });
    }
});


// Экспортируем действия и редьюсер
export const {
    recognitionPage,
    setPageKey,
    setSelectedRegionForPage,
    setInputValueInn,
    setFilterStatusIp,
    setFilterCategory,
    setFilterSum,
    resetGlobal
} = mainSlice.actions;

export default mainSlice.reducer;