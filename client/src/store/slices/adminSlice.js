import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async Thunks
export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/admin/users');
            return response.data.data.users;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Error al cargar usuarios'
            );
        }
    }
);

export const updateUserAsAdmin = createAsyncThunk(
    'admin/updateUser',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/admin/users/${id}`, data);
            return response.data.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Error al actualizar usuario'
            );
        }
    }
);

export const deleteUserAsAdmin = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Error al eliminar usuario'
            );
        }
    }
);

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateUserAsAdmin
            .addCase(updateUserAsAdmin.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    // Update user properties but keep the stats
                    state.users[index] = { ...state.users[index], ...action.payload };
                }
            })
            // deleteUserAsAdmin
            .addCase(deleteUserAsAdmin.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            });
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
