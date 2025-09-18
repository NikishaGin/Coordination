import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { ActivesType } from "../../constants.js";
import { thunkGetActive } from "./activeThunks.js";



export const fetchGetActive = createAsyncThunk('actives/fetchGetActive', thunkGetActive);


const activesData = {
    tableData: [],
    selectedRows: [],
};

const initialState = {
    type: ActivesType.TRANSPORT,
    status: 'idle',
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
            const currentActive = state.currentActive;
            const selectedRows = state.data[currentActive].selectedRows;
            state.data[currentActive].selectedRows = selectedRows.includes(payload)
                ? selectedRows.filter(index => index !== payload)
                : [ ...selectedRows, payload ];
        },
        clearSelectedRows: (state) => {
            Object.keys(ActivesType).forEach((key) => {
                state.data[key].selectedRows = [];
            });
        },
        clearActives: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetActive.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetActive.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state[state.type] = payload;
            })
            .addCase(fetchGetActive.rejected, (state, { payload }) => {
                state.status = 'failed';
                state.error = payload;
            })

            /*
            .addCase(updateActiveThunk.fulfilled, (state, action) => {
                const {id, field, value, type} = action.payload;
                const list = state[type];
                const index = list.findIndex(item => item.id === id);
                if (index !== -1) {
                    if (field) {
                        // Обновление одного поля
                        state[type][index][field] = value;
                    } else if (typeof value === 'object') {
                        // Обновление нескольких полей
                        Object.entries(value).forEach(([key, val]) => {
                            state[type][index][key] = val;
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


export const { toggleSelectedRow, clearSelectedRows, clearActives } = activesSlice.actions;



export default activesSlice.reducer;