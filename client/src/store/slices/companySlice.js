import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const fetchCompanies = createAsyncThunk(
    'companies/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/companies');
            // Assuming response.data.data is the array of companies based on standard API pattern
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al cargar empresas');
        }
    }
);

export const createCompany = createAsyncThunk(
    'companies/create',
    async (companyData, { rejectWithValue }) => {
        try {
            const response = await api.post('/companies', companyData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al crear empresa');
        }
    }
);

export const deleteCompany = createAsyncThunk(
    'companies/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/companies/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al eliminar empresa');
        }
    }
);

// Initial State
const activeCompany = JSON.parse(localStorage.getItem('activeCompany')) || null;

const initialState = {
    companies: [],
    activeCompany: activeCompany,
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setActiveCompany: (state, action) => {
            state.activeCompany = action.payload;
            localStorage.setItem('activeCompany', JSON.stringify(action.payload));
        },
        clearCompanyContext: (state) => {
            state.activeCompany = null;
            state.companies = [];
            localStorage.removeItem('activeCompany');
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Companies
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Company
            .addCase(createCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.companies.push(action.payload);
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Company
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.companies = state.companies.filter(c => c._id !== action.payload);
                if (state.activeCompany && state.activeCompany._id === action.payload) {
                    state.activeCompany = null;
                    localStorage.removeItem('activeCompany');
                }
            });
    },
});

export const { setActiveCompany, clearCompanyContext } = companySlice.actions;
export default companySlice.reducer;
