import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';

import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholder Pages (Temporary)
const Home = () => (
  <div className="layout-container py-20 text-center">
    <h1 className="text-4xl font-bold text-brand-primary mb-4">Simplifica tu Nómina</h1>
    <p className="text-xl text-gray-600">Gestión eficiente para empresas modernas.</p>
  </div>
);

const Dashboard = () => <div className="layout-container py-20 text-center">Dashboard Placeholder (Protected)</div>;
const Services = () => <div className="layout-container py-20 text-center">Nuestros Servicios</div>;
const Contact = () => <div className="layout-container py-20 text-center">Contacto</div>;
const About = () => <div className="layout-container py-20 text-center">Quienes Somos</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg font-sans text-gray-800">
        <Toaster position="top-right" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* Fallback */}
            <Route path="*" element={<div className="text-center py-20">404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
