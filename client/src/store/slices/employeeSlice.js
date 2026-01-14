import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const fetchEmployees = createAsyncThunk(
    'employees/fetch',
    async (companyId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/employees?companyId=${companyId}&limit=100`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al cargar empleados');
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/create',
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await api.post('/employees', employeeData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al crear empleado');
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/employees/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al eliminar empleado');
        }
    }
);

const initialState = {
    employees: [],
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        clearEmployeeState: (state) => {
            state.employees = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(e => e._id !== action.payload);
            });
    },
});

export const { clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
