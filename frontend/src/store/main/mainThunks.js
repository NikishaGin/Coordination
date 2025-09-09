import {MainAPI} from "../API.js";
import axios from "axios";
import { getPageQueryParams } from '../../utils/getPageQueryParams.js';


// глобальная переменная для хранения текущего контроллера
let currentAbortController = null;


export const thunkGetRegions = async (_, { rejectWithValue }) => {
    try {
        const query = getPageQueryParams();
        const response = await MainAPI.getRegions(query);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetStatusesIP = async (_, { rejectWithValue }) => {
    try {
        const query = getPageQueryParams();
        const response = await MainAPI.getStatusesIP(query);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetClientCategories = async (_, { rejectWithValue }) => {
    try {
        const query = getPageQueryParams();
        const response = await MainAPI.getClientCategories(query);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
};


export const thunkGetClients = async (_, { rejectWithValue }) => {
    if (currentAbortController) {
        currentAbortController.abort(); // отменяем предыдущий
    }
    currentAbortController = new AbortController();
    const { signal } = currentAbortController;

    try {
        const query = getPageQueryParams()
        const response = await MainAPI.getClients(query, signal);
        return response.data;
    } catch (error) {
        if (axios.isCancel?.(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
            console.warn("Запрос был отменен");
            return rejectWithValue("Request cancelled");
        }
        return rejectWithValue(error.response?.data || error.message);
    }
};


/**
 * // Можно сделоц так, если понравится:

 * let currentAbortController = null;
 *
 * const handleRequest = async (apiCall, rejectWithValue) => {
 *   try {
 *     const response = await apiCall();
 *     return response.data;
 *   } catch (error: any) {
 *     console.error("Ошибка при загрузке данных:", error);
 *     return rejectWithValue(error.response?.data || error.message);
 *   }
 * };
 *
 * const createAbortableThunk = (apiMethod) => async (_, { rejectWithValue }) => {
 *   if (currentAbortController) currentAbortController.abort();
 *   currentAbortController = new AbortController();
 *   const { signal } = currentAbortController;
 *
 *   return handleRequest(() => apiMethod(getPageQueryParams(), signal), rejectWithValue);
 * };
 *
 * const createThunk = (apiMethod) => async (_, { rejectWithValue }) =>
 *   handleRequest(() => apiMethod(getPageQueryParams()), rejectWithValue);
 *
 * export const thunkGetRegions = createThunk(MainAPI.getRegions);
 * export const thunkGetStatusesIP = createThunk(MainAPI.getStatusesIP);
 * export const thunkGetClientCategories = createThunk(MainAPI.getClientCategories);
 *
 * export const thunkGetClients = createAbortableThunk(MainAPI.getClients);
 *
 * // - Это все работает, т.к. управление идет целиком через extraReducers,
 * // и ничего, кроме обработки ошибки и сигнала отмены, вроде, и не надо
 */