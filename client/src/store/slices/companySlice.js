import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    companies: [],
    activeCompany: null, // Empresa seleccionada para operar
    loading: false,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setActiveCompany: (state, action) => {
            // Recibe la empresa completa o el ID
            state.activeCompany = action.payload;
        },
        clearCompanyContext: (state) => {
            state.activeCompany = null;
        }
    },
});

export const { setCompanies, setActiveCompany, clearCompanyContext } = companySlice.actions;
export default companySlice.reducer;
