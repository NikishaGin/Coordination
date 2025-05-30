import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fileStorageAPI } from "../api/index.js";



export const fetchGetDocuments = createAsyncThunk(
    "fileStorage/fetchGetDosuments",
    async (pathname, {rejectWithValue}) => {
        try {
            const source = pathname.split("-").pop()
            const response = await fileStorageAPI.getDocuments(source)
            console.log('response.data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
);


export const fetchSaveDocument = createAsyncThunk(
    "fileStorage/fetchSaveDocument",
    async ({pathname, name, file}, {rejectWithValue}) => {
        try {
            const source = pathname.split("-").pop()
            const formData = new FormData();
            formData.append('name', name)
            formData.append('file', file)
            const response = await fileStorageAPI.saveDocument(source, formData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }    }
)


const fileStorageSlice = createSlice({
    name: "fileStorage",
    initialState: {
        documents: [],
    },
    extraReducers: builder => {
        builder
            .addCase(fetchGetDocuments.fulfilled, (state, action) => {
                state.documents = action.payload;
            })
            .addCase(fetchSaveDocument.fulfilled, (state, action) => {
                console.log('Новый документ:', action.payload);
                state.documents = [...state.documents, action.payload];
            })
    }
})

export default fileStorageSlice.reducer;