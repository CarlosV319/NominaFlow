import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import employeeReducer from './slices/employeeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        company: companyReducer,
        employee: employeeReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});
