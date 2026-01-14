import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const createReceipt = createAsyncThunk(
    'receipts/create',
    async (receiptData, { rejectWithValue }) => {
        try {
            const response = await api.post('/receipts', receiptData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al generar recibo');
        }
    }
);

export const fetchReceipts = createAsyncThunk(
    'receipts/fetch',
    async (filters, { rejectWithValue }) => {
        try {
            // filters can be { companyId, mes, anio }
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/receipts?${params}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al cargar recibos');
        }
    }
);

const initialState = {
    receipts: [],
    loading: false,
    error: null,
    success: false // Useful for redirects
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {
        resetReceiptStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createReceipt.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createReceipt.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.receipts.unshift(action.payload);
            })
            .addCase(createReceipt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch
            .addCase(fetchReceipts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReceipts.fulfilled, (state, action) => {
                state.loading = false;
                state.receipts = action.payload;
            })
            .addCase(fetchReceipts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetReceiptStatus } = receiptSlice.actions;
export default receiptSlice.reducer;
