import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { thunkGetResolutions, thunkGetActivesStatistics, thunkGetInteractions } from "./clientThunks.js";
import { ActivesType, InteractionType } from "../../constants.js";



export const fetchGetResolutions = createAsyncThunk('client/fetchGetResolutions', thunkGetResolutions)
export const fetchGetActivesStatistics = createAsyncThunk('client/fetchGetActivesStatistics', thunkGetActivesStatistics)
export const fetchGetInteractions = createAsyncThunk('client/fetchGetInteractions', thunkGetInteractions)

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
        values: {
            stats: [],
            TOTAL: null,
        }
    },
    interactions: {
        type: InteractionType.GMU,
        [InteractionType.GMU]: [],
        [InteractionType.TNO]: [],
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
            })
            .addCase(fetchGetActivesStatistics.fulfilled, (state, { payload }) => {
                state.activesStatistics.values = payload;
                state.activesStatistics.loading = false;
            })
            .addCase(fetchGetActivesStatistics.rejected, (state) => {
                state.activesStatistics.loading = false;
            })
            .addCase(fetchGetInteractions.fulfilled, (state, { payload }) => {
                const { type, data } = payload;
                state.interactions.type = type;
                state.interactions[type] = data;
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
export const useInteraction = () => useSelector((state) => state.client.interactions[state.client.interactions.type]);

export default clientSlice.reducer;