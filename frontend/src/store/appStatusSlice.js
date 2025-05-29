import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};

const appStatusSlice = createSlice({
    name: 'appStatus',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = appStatusSlice.actions;
export default appStatusSlice.reducer;
