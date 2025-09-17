import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { thunkGetResolutions, thunkGetActivesStatistics } from "./clientThunks.js";
import { ActivesType } from "../../constants.js";



export const fetchGetResolutions = createAsyncThunk('client/fetchGetResolutions', thunkGetResolutions)
export const fetchGetActivesStatistics = createAsyncThunk('client/fetchGetActivesStatistics', thunkGetActivesStatistics)

const statisticalValues = { amount: 0, count: 0 };
const initialState = {
    clientId: null,
    info: {
        CodeTNO: null,
        inn: null,
        name: null,
        category: null,
        CodeSOSP: null,
    },
    resolutions: [],
    activesStatistics: {
        loading: true,
        received: false,
        values: {
            [ActivesType.TRANSPORT]: statisticalValues,
            [ActivesType.PROPERTY]: statisticalValues,
            [ActivesType.GROUND]: statisticalValues,
            [ActivesType.DEBIT]: statisticalValues,
            [ActivesType.OTHER]: statisticalValues,
            TOTAL: statisticalValues,
        }
    },
    interactions: {
        GMU: [],
        TNO: [],
    },
};

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        setClientInfo: (state, { payload }) => {
            state.clientId = payload.id;
            state.info.CodeTNO = payload.tno?.CodeTNO;
            state.info.inn = payload.inn;
            state.info.name = payload.name;
            state.info.category = payload.category.category;
            state.info.CodeSOSP = payload.sosp?.CodeSOSP;
        },
        clearClient: () => initialState,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetResolutions.fulfilled, (state, { payload }) => {
                state.resolutions = payload;
            })
            .addCase(fetchGetActivesStatistics.pending, (state) => {
                state.activesStatistics.loading = true;
                state.activesStatistics.received = false;
            })
            .addCase(fetchGetActivesStatistics.fulfilled, (state, { payload }) => {
                state.activesStatistics.values.TOTAL = payload;
                payload.forEach(({ type, _sum, _count }) => {
                    state.activesStatistics.values[type].amount = _sum.cost;
                    state.activesStatistics.values[type].count = _count.id;
                    state.activesStatistics.values.TOTAL.amount += _sum.cost;
                    state.activesStatistics.values.TOTAL.count += _count.id;
                });
                state.activesStatistics.loading = false;
                state.activesStatistics.received = true;
            })
            .addCase(fetchGetActivesStatistics.rejected, (state) => {
                state.activesStatistics.loading = false;
                state.activesStatistics.received = false;
            })
    }
});


export const {
    setClientInfo,
    clearClient,
} = clientSlice.actions;

export const useClientId = () => useSelector((state) => state.client.clientId);
export const useClientInfo = () => useSelector((state) => state.client.info);
export const useResolutions = () => useSelector((state) => state.client.resolutions);
export const useActivesStatistics = () => useSelector((state) => state.client.activesStatistics);

export default clientSlice.reducer;