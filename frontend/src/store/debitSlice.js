import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formatNumber, transformDateForInput } from "../utils/formatData.js";
import { activesAPI } from "../api/index.js";

// Асинхронный thunk для загрузки данных
export const fetchDebit = createAsyncThunk(
    'debit/fetchDebit',
    async (inn, { rejectWithValue }) => {
        try {
            const response = await activesAPI.getDebt(inn);
            return response.data.map(item => ({
                ...item,
                date: transformDateForInput(item.date),
                total_sum: formatNumber(item.total_sum),
            }));
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            return rejectWithValue(error.message);
        }
    }
);


// Slice
const debitSlice = createSlice({
    name: 'debit',
    initialState: {
        data: [], // Массив данных
        status: 'idle', // Статус загрузки ('idle', 'loading', 'succeeded', 'failed')
        error: null, // Ошибка, если она возникла
    },
    reducers: {
        // reducer для обновления данных
        updateDebitRow: (state, action) => {
            const { id, field, value } = action.payload; // Получаем ID, поле и новое значение
            const rowToUpdate = state.data.find(item => item.id === id); // Находим строку для обновления
            if (rowToUpdate) {
                rowToUpdate[field] = value; // Обновляем поле
            }
        },
        // reducer для добавления строки
        addDebitRow: (state) => {
            const hasEmptyRow = state.data.some(row => !row.debitor_names && row.type === "insert");
            if (!hasEmptyRow) {
                const newId = Date.now(); // Генерируем уникальный ID
                state.data.push({ id: newId, type: "insert" }); // Добавляем новую строку
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDebit.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDebit.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchDebit.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Экспортируем actions
export const { updateDebitRow, addDebitRow } = debitSlice.actions;

export default debitSlice.reducer;