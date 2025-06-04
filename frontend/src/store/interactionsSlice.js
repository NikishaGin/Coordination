import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { interactionAPI } from "../api/index.js";



export const fetchGetInteractions = createAsyncThunk(
    "interactions/fetchGetInteractions",
    async ({source, inn}, {rejectWithValue}) => {
        try {
            const response = await interactionAPI.getInteractions(source, inn);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
);


export const fetchSaveInteraction = createAsyncThunk(
    "interactions/fetchSaveInteraction",
    async ({source, inn, data}, {rejectWithValue}) => {
        try {
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
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
)


const interactionsSlice = createSlice({
    name: "interactions",
    initialState: {
        interactions: [],
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetInteractions.fulfilled, (state, action) => {
                state.interactions = action.payload;
            })
            .addCase(fetchSaveInteraction.fulfilled, (state, action) => {
                const { type, data } = action.payload;
                console.log(type)
                if (type === 'update') {
                    const index = state.interactions.findIndex(row => Number(row.id) === Number(data.id));
                    state.interactions[index] = data;
                } else if (type === 'insert') {
                    state.interactions = [ ...state.interactions, data ];
                }
            })
    }
})

export default interactionsSlice.reducer;
