import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {formatNumber, transformDateForInput} from "../utils/formatData.js";
import {activesAPI} from "../api/index.js";
import {cleanTotalSum} from "../pages/Client/sections/Info/subsections/DebtorIndebtedness.jsx";

// Асинхронный thunk для загрузки данных
export const fetchDebit = createAsyncThunk(
    'debit/fetchDebit',
    async (inn, {rejectWithValue}) => {
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


// thunk для сохранения одной строки
export const saveDebitRow = createAsyncThunk(
    'debit/saveDebitRow',
    async ({inn, updatedRow}, {dispatch, rejectWithValue}) => {
        try {
            // Очищаем total_sum перед отправкой
            const cleanedRow = {
                ...updatedRow,
                total_sum: cleanTotalSum(updatedRow.total_sum),
            };

            // Отправляем данные на сервер
            await activesAPI.updateActives("debit", inn, {[cleanedRow.id]: cleanedRow});

            // Обновляем локальный store
            dispatch(updateDebitRow({id: updatedRow.id, field: null, value: cleanedRow}));

            // Загружаем актуальные данные с сервера
            await dispatch(fetchDebit(inn));

            return cleanedRow;
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
            return rejectWithValue(error.message);
        }
    }
);


export const createDebitRow = createAsyncThunk(
    'debit/createDebitRow',
    async ({ inn, newRow }, { dispatch, rejectWithValue }) => {
        try {

            console.log(newRow);

            const cleanedRow = {
                debitor_inn: newRow.inn,
                debitor_names: (newRow.debtorName.length > 0) ? newRow.debtorName : undefined,
                date: (newRow.petitionDate.length > 0) ? newRow.petitionDate : undefined,
                total_sum: (newRow.total_sum.length > 0) ? cleanTotalSum(newRow.amount) : undefined,
            };



            console.log("Отправка на сервер:", cleanedRow);



            await activesAPI.createNewActives("debit", inn, cleanedRow);

            // После успешного создания — подгружаем заново все данные
            await dispatch(fetchDebit(inn));

            return cleanedRow;
        } catch (error) {
            console.error("Ошибка при создании строки:", error);
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
        // reducer обновления ячейки
        updateDebitRow: (state, action) => {
            const {id, field, value} = action.payload;
            const index = state.data.findIndex(item => item.id === id);
            if (index !== -1) {
                if (field === null) {
                    // Если field === null, обновляем всю строку
                    state.data[index] = value;
                } else {
                    state.data[index][field] = value;
                }
            }
        },
        // reducer для добавления строки
        addDebitRow: (state, action) => {
            const { inn, debtorName, petitionDate, amount } = action.payload;

            const hasEmptyRow = state.data.some(row => !row.debitor_names && row.type === "insert");

            if (!hasEmptyRow) {
                const newId = Date.now();

                state.data.push({
                    id: newId,
                    type: "insert",
                    debitor_inn: inn,
                    debitor_names: debtorName || '',
                    date: petitionDate || '',
                    total_sum: amount || '',
                });
            }
        }


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
            })
            .addCase(createDebitRow.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createDebitRow.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createDebitRow.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
    },
});

// Экспортируем actions
export const {updateDebitRow, addDebitRow} = debitSlice.actions;

export default debitSlice.reducer;