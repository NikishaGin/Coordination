import {createAsyncThunk} from "@reduxjs/toolkit";
import {MainAPI} from "../API.js";
import axios from "axios";



// глобальная переменная для хранения текущего контроллера
let currentAbortController = null;


export const thunkGetRegions = async (_, { rejectWithValue, getState }) => {
    const { isDerived, isArchived } = getState().main
    const data = { isDerived, isArchived };
    try {
        const response = await MainAPI.getRegions(data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetStatusesIP = async (_, { rejectWithValue, getState }) => {
    const { isDerived, isArchived, selectedRegionId } = getState().main
    const data = { isDerived, isArchived, regionId: selectedRegionId };
    try {
        const response = await MainAPI.getStatusesIP(data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetClientCategories = async (_, { rejectWithValue, getState }) => {
    const { isDerived, isArchived, selectedRegionId } = getState().main
    const data = { isDerived, isArchived, regionId: selectedRegionId };
    try {
        const response = await MainAPI.getClientCategories(data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetClients = async (_, { rejectWithValue, getState }) => {
    if (currentAbortController) {
        currentAbortController.abort(); // отменяем предыдущий
    }
    currentAbortController = new AbortController();
    const { signal } = currentAbortController;
    const { isDerived, isArchived, selectedRegionId } = getState().main
    const data = { isDerived, isArchived, regionId: selectedRegionId };
    try {
        const response = await MainAPI.getClients(data, signal);
        return response.data;
    } catch (error) {
        if (axios.isCancel?.(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
            console.warn("Запрос был отменен");
            return rejectWithValue("Request cancelled");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
};