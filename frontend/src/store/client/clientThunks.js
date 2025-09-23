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


export const thunkGetInteractions = async (type, { rejectWithValue, getState }) => {
    const clientId = getState().client.clientId;
    if (!clientId) return rejectWithValue("Client ID not found");
    try {
        const response = await ClientAPI.getInteractions(clientId, type);
        return { type, data: response.data };
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}


export const thunkCreateInteraction = async ({ type, data }, { rejectWithValue, getState }) => {
    try {

        /*
        const keys = Object.keys(data);
        const result = {
            inn,
            id: data.id,
            submissionDate: data.submissionDate,
            reviewDate: data.reviewDate,
            result: data.result,
            ...((source === "tno") ? { kno: data.kno, note: data.note } : {}),
            updatingFirstFile: keys.includes("submissionFiles"),
            updatingSecondFile: keys.includes("resultFiles")
        }
        const formData = new FormData();
        formData.append("data", JSON.stringify(result));
        formData.append('firstFile', data.submissionFiles)
        formData.append('secondFile', data.resultFiles)
        const response  = await interactionAPI.saveInteraction(source, formData)
        if ((response.status < 200) || (response.status > 299))
            return rejectWithValue("Данные не обновлены")
        const newData = { ...data, ...response.data }
        return {data: newData, type: ((response.status === 201) ? 'insert' : 'update') }
        */

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}


export const thunkUpdateInteraction = async ({ type, data }, { rejectWithValue, getState }) => {
    try {

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}
