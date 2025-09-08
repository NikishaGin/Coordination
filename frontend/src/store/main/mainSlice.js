import { useMemo } from "react";
import { useSelector } from "react-redux";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    thunkGetRegions,
    thunkGetStatusesIP,
    thunkGetClientCategories,
    thunkGetClients,
} from './mainThunks.js'
import { extractValuesFromObject } from "../../utils/extractValuesFromObject.js";


export const fetchGetRegions = createAsyncThunk('main/fetchGetRegions', thunkGetRegions)
export const fetchGetStatusesIP = createAsyncThunk('main/fetchGetStatusesIP', thunkGetStatusesIP)
export const fetchGetClientCategories = createAsyncThunk('main/fetchGetClientCategories', thunkGetClientCategories)
export const fetchGetClients = createAsyncThunk('main/fetchGetClients', thunkGetClients)


const initialState = {
    pathname: '',
    isDerived: false,
    isArchived: false,
    allRegions: [],
    allClientCategories: [],
    allStatusesIP: [],
    selectedRegionIdByPage: {},
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
    },
};


const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        pageDetection(state, { payload }) {
            if (state.pathname !== payload) {
                state.pathname = payload;
                state.isArchived = ["/coordination-archive", "/derivative-archive"].includes(payload);
                state.isDerived = ["/derivative", "/derivative-archive"].includes(payload);
                state.clients = initialState.clients;
                state.filters = initialState.filters; // либо очищать фильтры, либо для каждой страницы свой фильтр? (!!!)
            }
        },
        setSelectedRegion(state, { payload }) {
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
        clearMain: () => initialState,
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

export const usePageMeta = () => {
    const isDerived = useSelector((state) => state.main.isDerived);
    const isArchived = useSelector((state) => state.main.isArchived);
    return { isDerived, isArchived };
}

export const useAllRegions = () => useSelector((state) => state.main.allRegions);

export const useAllClientCategories = () => useSelector((state) => state.main.allClientCategories);

export const useAllStatusesIP = () => useSelector((state) => state.main.allStatusesIP);

export const useSelectedRegionId = () => useSelector((state) => state.main.selectedRegionIdByPage?.[state.main.pathname]);

export const useFilters = () => useSelector((state) => state.main.filters);

export const useFilteredClients = () => {
    const filters = useFilters();
    const data = useSelector((state) => state.main.clients.data);
    return useMemo(() => {
        return data.filter((row) => {
            let isFiltered = true;
            if (filters.inputValueInn.length > 0)
                isFiltered &&= row.inn.startsWith(filters.inputValueInn);
            if (filters.statusIP.length > 0)
                isFiltered &&= row.statusIP === filters.statusIP;
            if (filters.categoryId)
                isFiltered &&= row.category?.id === filters.categoryId;
            if ((filters.amount.field.length > 0) && filters.amount.value)
                isFiltered &&= extractValuesFromObject(row, filters.amount.field) >= filters.amount.value;
            return isFiltered;
        });
    }, [data, filters]);
}


export default mainSlice.reducer;