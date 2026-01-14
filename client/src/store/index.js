import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import employeeReducer from './slices/employeeSlice';
import receiptReducer from './slices/receiptSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        company: companyReducer,
        employee: employeeReducer,
        receipt: receiptReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});
