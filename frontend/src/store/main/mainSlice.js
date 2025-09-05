import { createSlice } from "@reduxjs/toolkit";
import {
    fetchGetRegions,
    fetchGetStatusesIP,
    fetchGetClientCategories,
    fetchGetClients,
} from './mainThunks.js'
import { useSelector } from "react-redux";



const initialState = {
    pathname: '',
    isDerived: false,
    isArchived: false,
    allRegions: [],
    allClientCategories: [],
    allStatusesIP: [],
    selectedRegionIdByPage: {},
    selectedRegionId: null,
    clients: {
        data: [],
        isLoading: false,
        error: null,
    },
    filters: {
        inputValueInn: "",
        statusIP: "",
        categoryId: null,
        amount: {
            field: "",
            value: null
        },
    }
};


const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        pageDetection(state, { payload }) {
            state.pathname = payload;
            state.isArchived = ["/coordination-archive", "/coordination"].includes(payload);
            state.isDerived = ["/derivative-archive", "/derivative"].includes(payload);
            state.selectedRegionId = state.selectedRegionIdByPage[payload];
        },
        setSelectedRegion(state, { payload }) {
            state.selectedRegionId = payload;
            state.selectedRegionIdByPage[state.pathname] = payload;
        },
        setInputValueInn(state, { payload }) {
            state.filters.inputValueInn = payload;
        },
        setFilterStatusIp(state, { payload }) {
            state.filters.statusIP = payload;
        },
        setFilterCategory(state, { payload }) {
            state.filters.categoryId = payload;
        },
        setFilterAmount(state, { payload }) {
            state.filters.amount = payload;
        },
        clearMain(state) {
            Object.keys(state).forEach(key => {
                state[key] = initialState[key];
            });
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetRegions.fulfilled, (state, { payload }) => {
                state.allRegions = payload;
            })
            .addCase(fetchGetStatusesIP.fulfilled, (state, { payload }) => {
                state.allStatusesIP = payload;
            })
            .addCase(fetchGetClientCategories.fulfilled, (state, { payload }) => {
                state.allClientCategories = payload;
            })
            .addCase(fetchGetClients.pending, (state) => {
                state.clients.data = [];
                state.clients.isLoading = true;
                state.clients.error = null;
            })
            .addCase(fetchGetClients.fulfilled, (state, { payload }) => {
                state.clients.data = payload;
                state.clients.isLoading = false;
            })
            .addCase(fetchGetClients.rejected, (state, { error }) => {
                state.clients.error = error.message;
                state.clients.isLoading = false;
            });
    }
});


export const {
    pageDetection,
    setSelectedRegion,
    setInputValueInn,
    setFilterStatusIp,
    setFilterCategory,
    setFilterAmount,
    clearMain
} = mainSlice.actions;

export const getAllRegions = () => useSelector((state) => state.main.allRegions);
export const getAllClientCategories = () => useSelector((state) => state.main.allClientCategories);
export const getAllStatusesIP = () => useSelector((state) => state.main.allStatusesIP);
export const getSelectedRegionId = () => useSelector((state) => state.main.selectedRegionId);
export const getFilters = () => useSelector((state) => state.main.filters);

export const getFilteredClients = () => useSelector((state) => state.main.clients.data);


export default mainSlice.reducer;