import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { activesAPI, serviceAPI, userAPI } from "../api/index.js";
import {MainAPI} from "./API.js";
import axios from "axios";


/*
export const fetchGetRegions = createAsyncThunk(
    "main/fetchGetRegions",
    async (page, {rejectWithValue}) => {
        try {
            const response = await MainAPI.getRegions(page);
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchGetDebitTypes = createAsyncThunk(
    "main/fetchGetDebitTypes",
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
    "main/fetchGetServiceMode",
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
    "main/fetchToggleServiceMode",
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
*/



let currentAbortController = null; // глобальная переменная для хранения текущего контроллера


export const fetchGetRegions = createAsyncThunk(
    'main/fetchGetRegions',
    async (_, { rejectWithValue, getState }) => {
        const { isDerived, isArchived } = getState().main
        try {
            const response = await MainAPI.getRegions({ isDerived, isArchived });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGetClientCategories = createAsyncThunk(
    'main/fetchGetClientCategories',
    async () => {}
);

export const fetchGetStatusesIP = createAsyncThunk(
    'main/fetchGetStatusesIP',
    async () => {}
);

export const fetchGetClients = createAsyncThunk(
    'main/fetchGetClients',
    async (_, { dispatch, rejectWithValue, getState }) => {
        if (currentAbortController) {
            currentAbortController.abort(); // отменяем предыдущий
        }
        currentAbortController = new AbortController();
        const { signal } = currentAbortController;
        try {
            dispatch(setLoading(true));
            const { isDerived, isArchived, selectedRegionByPage } = getState().main
            const regionId = ;
            const response = await MainAPI.getClients({ isDerived, isArchived, regionId }, signal);
            return response.data;
        } catch (error) {
            if (axios.isCancel?.(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
                console.warn("Запрос был отменен");
                return rejectWithValue("Request cancelled");
            }
            return rejectWithValue(error.response?.data || error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
);



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