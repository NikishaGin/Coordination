import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {serviceAPI, userAPI} from "../api/index.js";
import { useState } from 'react';



export const fetchGetRegions = createAsyncThunk(
    "global/fetchGetRegions",
    async (page, {rejectWithValue}) => {
        try {
            const response = await serviceAPI.getRegions(page);
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchGetDebitTypes = createAsyncThunk(
    "global/fetchGetDebitTypes",
    async (_, {rejectWithValue}) => {
        try {
            const response = await serviceAPI.getTypesDebtorCategory();
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchGetServiceMode = createAsyncThunk(
    "global/fetchGetServiceMode",
    async (_, {rejectWithValue}) => {
        try {
            const response = await userAPI.getServiceMode();
            console.log(response.data);
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchToggleServiceMode = createAsyncThunk(
    "global/fetchToggleServiceMode",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            await userAPI.toggleServiceMode();
            dispatch(fetchGetServiceMode())
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)



// Начальное состояние
const initialState = {
    serviceMode: false,
    pageKey: "default",
    regions: [],
    debitTypes: [],
    selectedRegionByPage: {}, // добавили
    // selectedRegion: null,
    filters: {
        inputValueInn: "",
        status_ip: "",
        category: "",
        name_filtered_field: "",
        sum: ""
    }
};

// Создаем slice
const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
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
    setPageKey,
    setSelectedRegionForPage,
    setInputValueInn,
    setFilterStatusIp,
    setFilterCategory,
    setFilterSum,
    resetGlobal
} = globalSlice.actions;

export default globalSlice.reducer;