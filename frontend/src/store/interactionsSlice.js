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
    async ({type, data}, {rejectWithValue}) => {
        try {

            const sendData = Object.fromEntries(Object.entries(data).filter(([_, value]) => !!value))

            console.log(sendData)

            // const source = pathname.split("-").pop()
            // const formData = new FormData();
            // formData.append('name', name)
            // formData.append('file', file)
            // const response = await fileStorageAPI.saveDocument(source, formData);
            // return response.data;


            return (Object.keys(sendData) > 0) ? sendData : null;
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
                if (action.payload)
                    state.interactions = [...state.interactions, action.payload];
            })
    }
})

export default interactionsSlice.reducer;