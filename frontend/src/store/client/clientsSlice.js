import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { activesAPI, serviceAPI, userAPI } from "../../api/index.js";
import {MainAPI} from "../API.js";


/*
export const fetchGetResolutions = createAsyncThunk(
    'client/fetchGetResolutions',
    async ({inn, type}, {rejectWithValue}) => {
        try {
            const response = await activesAPI.getActives(inn, type);
            return {type, data: response.data};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
 */

const initialState = {
    info: {
        CodeTNO: '',
        inn: '',
        name: '',
        category: '',
        CodeSOSP: '',
    },
}

const clientSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        setClientInfo: (state, action) => {

        }
    }
})