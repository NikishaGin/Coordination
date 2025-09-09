import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {activesAPI} from "../api/index.js";


const cleanTotalSum = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        return Number(value.replace(/\s/g, '').replace(',', '.'));
    }
    return 0; // или выбросить ошибку
}

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

const activesSlice = createSlice({
    name: 'actives',
    initialState: {
        transport: new Set(),
        property: [],
        ground: [],
        debit: [],
        another: [],
        selectedRows: {
            transport: [],
            property: [],
            ground: [],
            debit: [],
            another: []
        },
        status: {
            transport: 'idle',
            property: 'idle',
            ground: 'idle',
            debit: 'idle',
            another: 'idle',
        },
        error: {
            transport: null,
            property: null,
            ground: null,
            debit: null,
            another: null,
        },
    },
    reducers: {
        clearActives: (state) => {
            state.transport = [];
            state.property = [];
            state.ground = [];
            state.debit = [];
            state.another = [];
            // Сбросим статус и ошибки тоже (по желанию)
            state.status = {
                transport: 'idle',
                property: 'idle',
                ground: 'idle',
                debit: 'idle',
                another: 'idle',
            };
            state.error = {
                transport: null,
                property: null,
                ground: null,
                debit: null,
                another: null,
            };
        },
        toggleSelectedRow: (state, action) => {
            const { type, index } = action.payload;
            state.selectedRows[type] = (state.selectedRows[type].includes(index))
                ? state.selectedRows[type].filter(i => i !== index)
                : [...state.selectedRows[type], index]
        },
        clearSelectedRows: (state) => {
            state.selectedRows = {
                transport: [],
                property: [],
                ground: [],
                debit: [],
                another: []
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActives.pending, (state, action) => {
                const type = action.meta.arg.type;
                state.status[type] = 'loading';
            })
            .addCase(fetchActives.fulfilled, (state, action) => {
                const {type, data} = action.payload;
                state.status[type] = 'succeeded';
                state[type] = data;
            })
            .addCase(fetchActives.rejected, (state, action) => {
                const type = action.meta.arg.type;
                state.status[type] = 'failed';
                state.error[type] = action.payload;
            })
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
    },
});

export default activesSlice.reducer;
export const {clearActives, toggleSelectedRow, clearSelectedRows} = activesSlice.actions;