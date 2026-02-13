import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Users, FileText, CheckCircle } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="overflow-hidden bg-brand-bg min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
                <div className="layout-container grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Copy */}
                    <div className="text-center lg:text-left z-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-secondary/10 text-brand-secondary text-sm font-bold mb-6 border border-brand-secondary/20">
                            <span className="flex h-2 w-2 rounded-full bg-brand-secondary mr-2"></span>
                            Nómina 2.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0F2C4C] leading-tight mb-6">
                            Gestión de Nómina <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D04] to-orange-600">
                                Simplificada
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Automatiza recibos, gestiona empleados y cumple con la normativa laboral en segundos.
                            Tu equipo merece lo mejor, y tú mereces tranquilidad.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/services"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-[#E85D04] rounded-xl hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 shadow-orange-900/20"
                            >
                                Explorar Servicios
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/planes"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-[#0F2C4C] transition-all duration-200 bg-white border-2 border-[#0F2C4C]/10 rounded-xl hover:bg-slate-50 hover:border-[#0F2C4C]/30"
                            >
                                Ver Planes
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-400 grayscale opacity-70">
                            {/* Trust Indicators / Social proof placeholders */}
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" /> +500 Empresas
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" /> Soporte 24/7
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Image & Floating Elements */}
                    <div className="relative z-10 lg:h-[600px] flex items-center justify-center perspective-1000">
                        {/* Main blob background effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-orange-100/50 rounded-full blur-3xl -z-10"></div>

                        {/* Main Illustration */}
                        <img
                            src="/hero_payroll_illustration.png"
                            alt="Gestión de Nómina 3D"
                            className="relative z-10 w-full max-w-lg drop-shadow-2xl animate-in zoom-in-50 duration-1000"
                        />

                        {/* Floating Icons */}
                        {/* Calculator - Top Left */}
                        <div className="absolute top-[10%] left-[5%] p-4 bg-white rounded-2xl shadow-xl shadow-blue-900/10 animate-float">
                            <Calculator size={32} className="text-[#0F2C4C]" />
                        </div>

                        {/* Users - Bottom Right */}
                        <div className="absolute bottom-[15%] right-[5%] p-4 bg-white rounded-2xl shadow-xl shadow-orange-900/10 animate-float-delayed">
                            <Users size={32} className="text-[#E85D04]" />
                        </div>

                        {/* Docs - Top Right */}
                        <div className="absolute top-[20%] right-[10%] p-3 bg-white rounded-xl shadow-lg animate-float-slow">
                            <FileText size={24} className="text-emerald-500" />
                        </div>

                        {/* Coin/Cost - Bottom Left */}
                        <div className="absolute bottom-[20%] left-[10%] p-3 bg-[#0F2C4C] rounded-xl shadow-lg animate-float">
                            <span className="text-white font-bold text-lg">$</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
