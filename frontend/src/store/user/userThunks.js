import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthAPI } from "../API.js";

export const fetchLoginUser = createAsyncThunk(
    'user/fetchLoginUser',
    async ({ login, password }) => {

        try {
            const response = await AuthAPI.login({ login, password });
            return response.data;
        } catch (error) {

        }


    }
)