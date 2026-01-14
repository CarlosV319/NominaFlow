import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout';

import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompanyListPage from './pages/dashboard/CompanyListPage';
import EmployeeListPage from './pages/dashboard/EmployeeListPage';
import EmployeeDetailPage from './pages/dashboard/EmployeeDetailPage';
import CreateReceiptPage from './pages/dashboard/CreateReceiptPage';
import ReceiptListPage from './pages/dashboard/ReceiptListPage';
import ReceiptPreviewPage from './pages/dashboard/ReceiptPreviewPage';


const Home = () => (
  <div className="layout-container py-20 text-center">
    <h1 className="text-4xl font-bold text-brand-primary mb-4">Simplifica tu Nómina</h1>
    <p className="text-xl text-gray-600">Gestión eficiente para empresas modernas.</p>
  </div>
);

const DashboardHome = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de Actividad</h2>
    <p className="text-gray-500">Bienvenido al panel de control.</p>
  </div>
);

const Services = () => <div className="layout-container py-20 text-center">Nuestros Servicios</div>;
const Contact = () => <div className="layout-container py-20 text-center">Contacto</div>;
const About = () => <div className="layout-container py-20 text-center">Quienes Somos</div>;

// Public Layout Wrapper
const PublicLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg font-sans text-gray-800">
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Private Routes (Dashboard) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="companies" element={<CompanyListPage />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="receipts" element={<ReceiptListPage />} />
            <Route path="receipts/new" element={<CreateReceiptPage />} />
            <Route path="receipts/:id/preview" element={<ReceiptPreviewPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="text-center py-20">404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
