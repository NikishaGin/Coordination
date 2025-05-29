import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {activesAPI} from "../api/index.js";
import {setLoading} from "./appStatusSlice.js";


export const fetchTableData = createAsyncThunk(
    'actives/fetchTableData',
    async ({ pageKey, region }, { dispatch, rejectWithValue }) => {
        console.log('pageKey', pageKey)
        try {
            dispatch(setLoading(true));
            const response = await activesAPI.getTables(pageKey, region);

            // await new Promise((resolve) => setTimeout(resolve, 500));

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        } finally {
            dispatch(setLoading(false));
        }
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
