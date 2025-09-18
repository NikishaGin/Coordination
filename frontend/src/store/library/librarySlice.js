import { createSlice } from "@reduxjs/toolkit";


const librarySlice = createSlice({
    name: "library",
    initialState: {
        documents: [],
    },
    extraReducers: builder => {
        /*
        builder
            .addCase(fetchGetDocuments.fulfilled, (state, action) => {
                state.documents = action.payload;
            })
            .addCase(fetchSaveDocument.fulfilled, (state, action) => {
                console.log('Новый документ:', action.payload);
                state.documents = [...state.documents, action.payload];
            })
         */
    }
})

export default librarySlice.reducer;