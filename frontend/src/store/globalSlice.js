import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {serviceAPI} from "../api/index.js";



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
            const response = await serviceAPI.getDebtTypes();
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchCheckServiceMode = createAsyncThunk(
    "global/fetchCheckServiceMode",
    async (_, {rejectWithValue}) => {
        try {
            const response = await serviceAPI.checkServiceMode();
            return response.data
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


export const fetchChangeServiceMode = createAsyncThunk(
    "global/fetchChangeServiceMode",
    async (_, {rejectWithValue}) => {
        try {
            await serviceAPI.changeServiceMode();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)



// Начальное состояние
const initialState = {
    serviceMode: false,
    regions: [],
    debitTypes: [],
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
    extraReducers: builder => {
        builder
            .addCase(fetchGetRegions.fulfilled, (state, action) => {
                state.regions = action.payload;
            })
            .addCase(fetchGetDebitTypes.fulfilled, (state, action) => {
                state.debitTypes = action.payload;
            })
            .addCase(fetchCheckServiceMode.fulfilled, (state, action) => {
                state.serviceMode = action.payload;
            })
            .addCase(fetchChangeServiceMode.fulfilled, (state) => {
                state.serviceMode = !state.serviceMode;
            })
    }
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