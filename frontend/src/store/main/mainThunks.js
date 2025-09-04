import {createAsyncThunk} from "@reduxjs/toolkit";
import {MainAPI} from "../API.js";
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


/*

const tableDataSlice = createSlice({
    name: "tableData",
    initialState: {
        tableData: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTableData.pending, (state) => {
                state.tableData = []
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTableData.fulfilled, (state, action) => {
                state.tableData = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchTableData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});
 */