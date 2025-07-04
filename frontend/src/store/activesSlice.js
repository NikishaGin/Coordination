import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {activesAPI} from "../api/index.js";
import {setLoading} from "./appStatusSlice.js";

function  cleanTotalSum(value){
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
            return updatedRow;
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
            await activesAPI.createNewActives(nameActive, inn, data);
            return {nameActive, data};
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
            return rejectWithValue(error.message);
        }
    }
);

const activesSlice = createSlice({
    name: 'actives',
    initialState: {
        transport: [],
        property: [],
        ground: [],
        debit: [],
        another: [],
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
        updateActiveField: (state, action) => {
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
        },
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
                // можно обработать успех
            })
            .addCase(createRow.fulfilled, (state, action) => {
                const {nameActive, data} = action.payload;
                state[nameActive].push(data);
            });
    },
});

export default activesSlice.reducer;
export const {updateActiveField, clearActives} = activesSlice.actions;
