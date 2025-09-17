import { ClientAPI, ActiveAPI } from "../API.js";



export const thunkGetResolutions = async (_, { rejectWithValue, getState }) => {
    const { isDerived, isArchived } = getState().main;
    const clientId = getState().client.clientId;
    if (!clientId) return rejectWithValue("Client ID not found");
    const data = { isDerived, isArchived };
    try {
        const response = await ClientAPI.getResolutions(clientId, data);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}


export const thunkGetActivesStatistics = async (_, { rejectWithValue, getState }) => {
    const clientId = getState().client.clientId;
    if (!clientId) return rejectWithValue("Client ID not found");
    try {
        const response = await ActiveAPI.getActivesStatistics(clientId);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}