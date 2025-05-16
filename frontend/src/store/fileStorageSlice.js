import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fileStorageAPI } from "../api/index.js";



export const fetchGetDocuments = createAsyncThunk(
    "fileStoragefetchGetDosuments",
    async (pathname) => {
        const source = pathname.split("-").pop()
        const response = await fileStorageAPI.getDocuments(source)
        return response.data;
    }
);


export const fetchSaveDocument = createAsyncThunk(
    "fileStorage/fetchSaveDocument",
    async ({pathname, name, file}) => {
        const source = pathname.split("-").pop()
        const formData = new FormData();
        formData.append('name', name)
        formData.append('file', file)
        const response = await fileStorageAPI.saveDocument(source, formData);
        return response.data;
    }
)


const fileStorageSlice = createSlice({
    name: "fileStorage",
    initialState: [],
    extraReducers: builder => {
        builder
            .addCase(fetchGetDocuments.fulfilled, (state, action) => {
                state.state = action.payload;
            })
            .addCase(fetchSaveDocument.fulfilled, (state, action) => {
                state.state = [...state, action.payload];
            })
    }
})

export default fileStorageSlice.reducer;