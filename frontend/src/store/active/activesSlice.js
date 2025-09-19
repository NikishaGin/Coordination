import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { ActivesType } from "../../constants.js";
import { thunkGetActive } from "./activeThunks.js";
import {useSelector} from "react-redux";



export const fetchGetActive = createAsyncThunk('actives/fetchGetActive', thunkGetActive);


const activesData = {
    tableData: [],
    selectedRows: [],
};

const initialState = {
    typeActive: ActivesType.TRANSPORT,
    loadingStatus: 'idle',
    error: null,
    data: {
        [ActivesType.TRANSPORT]: activesData,
        [ActivesType.PROPERTY]: activesData,
        [ActivesType.GROUND]: activesData,
        [ActivesType.DEBIT]: activesData,
        [ActivesType.OTHER]: activesData,
    }
};




const activesSlice = createSlice({
    name: 'actives',
    initialState,
    reducers: {
        toggleSelectedRow: (state, { payload }) => {
            const selectedRows = state.data[state.typeActive].selectedRows;
            state.data[state.typeActive].selectedRows = selectedRows.includes(payload)
                ? selectedRows.filter(index => index !== payload)
                : [ ...selectedRows, payload ];
        },
        clearSelectedRows: (state) => {
            Object.keys(ActivesType).forEach((typeActive) => {
                state.data[typeActive].selectedRows = [];
            });
        },
        clearActives: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetActive.pending, (state) => {
                state.loadingStatus = 'loading';
            })
            .addCase(fetchGetActive.fulfilled, (state, { payload }) => {
                const { typeActive, data } = payload;
                state.loadingStatus = 'succeeded';
                state.data[typeActive].tableData = data;
                state.typeActive = typeActive;
            })
            .addCase(fetchGetActive.rejected, (state, { payload }) => {
                state.loadingStatus = 'failed';
                state.error = payload;
            })

            /*
            .addCase(updateActiveThunk.fulfilled, (state, action) => {
                const {id, field, value, typeActive} = action.payload;
                const list = state[typeActive];
                const index = list.findIndex(item => item.id === id);
                if (index !== -1) {
                    if (field) {
                        // Обновление одного поля
                        state[typeActive][index][field] = value;
                    } else if (typeActiveof value === 'object') {
                        // Обновление нескольких полей
                        Object.entries(value).forEach(([key, val]) => {
                            state[typeActive][index][key] = val;
                        });
                    }
                }
            })
            .addCase(createRow.fulfilled, (state, action) => {
                const {nameActive, data} = action.payload;
                state[nameActive].push(data);
            });
             */
    },
});


export const {
    toggleSelectedRow,
    clearSelectedRows,
    clearActives
} = activesSlice.actions;

export const useActive = () => useSelector(state => state.actives.data[state.actives.typeActive].tableData);
export const useSelectedRows = () => useSelector(state => state.actives.data[state.actives.typeActive].selectedRows);
export const useLoadingStatus = () => useSelector(state => state.actives.loadingStatus);
export const useActiveType = () => useSelector(state => state.actives.typeActive);

export default activesSlice.reducer;