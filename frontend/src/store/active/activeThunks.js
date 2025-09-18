import { ActiveAPI } from "../API.js";


export const thunkGetActive = async (_, { rejectWithValue, getState }) => {
    const clientId = getState().client.clientId;
    const type = getState().actives.type;
    if (!clientId) return rejectWithValue("Client ID not found");
    try {
        const response = await ActiveAPI.getActives(clientId, type);
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return rejectWithValue(error.message);
    }
}

/*


// Общая асинхронная загрузка
export const fetchActives = createAsyncThunk(
    'actives/fetchActives',
    async ({inn, type}, {rejectWithValue}) => {
        try {
            const response = await activesAPI.getActives(inn, type);
            return {type, data: response.data};
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// thunk для сохранения одной строки
export const updateActiveThunk = createAsyncThunk(
    'actives/updateActive',
    async ({id, type, inn, updatedRow}, {rejectWithValue}) => {
        try {
            await activesAPI.updateActives(type, inn, {[id]: updatedRow});
            console.log('updatedRow', updatedRow)
            const [field, value] = Object.entries(updatedRow)[0]
            return {id, type, field, value};






        } catch (error) {
            console.error("Ошибка при обновлении:", error);
            return rejectWithValue(error.message);
        }
    }
);

// thunk для добавленния строки
export const createRow = createAsyncThunk(
    'actives/createRow',
    async ({inn, data, nameActive}, {rejectWithValue}) => {
        try {
            const newRow = Object.fromEntries(Object.entries(data).map(([field, value]) => [field, value || null]));
            const response = await activesAPI.createNewActives(nameActive, inn, newRow);
            return {nameActive, data: { ...data, id: response.data.newId }};
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
            return rejectWithValue(error.message);
        }
    }
);

 */