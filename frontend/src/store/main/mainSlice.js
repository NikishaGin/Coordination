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
        category: "",
        name_filtered_field: "",
        sum: null,
    }
};


const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        recognitionPage(state, { payload }) {
            state.pathname = payload;
            state.isArchived = ["/coordination-archive", "/coordination"].includes(payload);
            state.isDerived = ["/derivative-archive", "/derivative"].includes(payload);
            state.selectedRegionId = state.selectedRegionIdByPage[payload];
        },
        setSelectedRegion(state, { payload }) {
            state.selectedRegionId = payload;
            state.selectedRegionIdByPage[state.pathname] = payload;
        },
        setInputValueInn(state, action) {
            state.filters.inputValueInn = action.payload;
        },
        setFilterStatusIp(state, action) {
            state.filters.statusIP = action.payload;
        },
        setFilterCategory(state, action) {
            state.filters.category = action.payload;
        },
        setFilterSum(state, action) {
            state.filters.sum = action.payload.sum;
            state.filters.name_filtered_field = action.payload.name_filtered_field;
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
    recognitionPage,
    setSelectedRegion,
    setInputValueInn,
    setFilterStatusIp,
    setFilterCategory,
    setFilterSum,
    clearMain
} = mainSlice.actions;



export const useAllRegions = useSelector((state) => state.main.allRegions);
export const useAllClientCategories = useSelector((state) => state.main.allClientCategories);
export const useAllStatusesIP = useSelector((state) => state.main.allStatusesIP);
export const useSelectedRegionId = useSelector((state) => state.main.selectedRegionId);
export const useClients = useSelector((state) => state.main.clients.data);
export const useFilters = useSelector((state) => state.main.filters);


export default mainSlice.reducer;