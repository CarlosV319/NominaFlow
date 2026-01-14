import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data; // Expected { status, data: { user, token } }
        } catch (err) {
            console.error('Registration Error:', err.response?.data || err.message);
            return rejectWithValue(err.response?.data?.message || 'Error al registrar');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data; // Expected { status, data: { user, token } }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Error al iniciar sesión');
        }
    }
);

// Initial State with Persistence Check
const token = localStorage.getItem('token');
const getUserFromStorage = () => {
    try {
        const item = localStorage.getItem('user');
        return item && item !== 'undefined' ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};
const user = getUserFromStorage();

const initialState = {
    user: user || null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user; // Adjust structure if needed
                state.token = action.payload.token || action.payload.data.token;

                localStorage.setItem('token', state.token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.token = action.payload.token || action.payload.data.token;

                localStorage.setItem('token', state.token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
