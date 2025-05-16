import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {activesAPI} from "../api/index.js";


const clientSlice = createSlice({
    name: "clientSlice",
    initialState: {},
    reducers: {}
})


export default clientSlice.reducer;