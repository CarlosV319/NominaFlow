import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchFormulas = createAsyncThunk('formulas/fetchFormulas', async (tenantId, { rejectWithValue }) => {
    try {
        const url = tenantId ? `/formulas?tenantId=${tenantId}` : '/formulas';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching formulas');
    }
});

export const createFormula = createAsyncThunk('formulas/createFormula', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post('/formulas', data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error creating formula');
    }
});

export const updateFormula = createAsyncThunk('formulas/updateFormula', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/formulas/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error updating formula');
    }
});

export const deleteFormula = createAsyncThunk('formulas/deleteFormula', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/formulas/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error deleting formula');
    }
});

const formulaSlice = createSlice({
    name: 'formulas',
    initialState: {
        formulas: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFormulas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFormulas.fulfilled, (state, action) => {
                state.loading = false;
                state.formulas = action.payload;
            })
            .addCase(fetchFormulas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createFormula.fulfilled, (state, action) => {
                state.formulas.push(action.payload);
            })
            .addCase(updateFormula.fulfilled, (state, action) => {
                const index = state.formulas.findIndex((f) => f._id === action.payload._id);
                if (index !== -1) {
                    state.formulas[index] = action.payload;
                }
            })
            .addCase(deleteFormula.fulfilled, (state, action) => {
                state.formulas = state.formulas.filter((f) => f._id !== action.payload);
            });
    },
});

export default formulaSlice.reducer;
