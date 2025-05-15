import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {activesAPI} from "../api/index.js";


export const fetchTableData = createAsyncThunk(
    "actives/fetchTableData",
    async (region) => {
        const response = await activesAPI.getTables("Index", region);
        return response.data;
    }
);

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
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTableData.fulfilled, (state, action) => {
                state.tableData = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchTableData.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            });
    },
});

export default tableDataSlice.reducer;
