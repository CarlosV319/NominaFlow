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

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="layout-container">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-brand-secondary font-bold uppercase tracking-wider text-sm mb-2 block">Por qué elegirnos</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Todo lo que necesitas para tu nómina</h2>
                        <p className="text-slate-600 text-lg">
                            Una plataforma diseñada para simplificar la vida de empresarios y contadores.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calculator size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Cálculos Precisos</h3>
                            <p className="text-slate-600">Olvídate de los errores manuales. Nuestro motor de cálculo se actualiza con las últimas normativas.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Gestión de Personal</h3>
                            <p className="text-slate-600">Centraliza legajos, vacaciones y licencias en un solo lugar accesible 24/7.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Recibos Digitales</h3>
                            <p className="text-slate-600">Envía recibos firmados digitalmente a tus empleados con un solo clic. Ahorra papel y tiempo.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-brand-bg border-y border-slate-200">
                <div className="layout-container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16">Lo que dicen nuestros clientes</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex gap-1 mb-4 text-orange-400">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"NominaFlow cambió completamente la forma en que gestionamos los sueldos. Antes tardábamos días, ahora son horas."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">JP</div>
                                <div>
                                    <p className="font-bold text-slate-800">Juan Pérez</p>
                                    <p className="text-xs text-slate-500">CEO, TechStart</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex gap-1 mb-4 text-orange-400">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"La interfaz es súper intuitiva y el soporte es excelente. Recomendado para cualquier PyME."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">MG</div>
                                <div>
                                    <p className="font-bold text-slate-800">María García</p>
                                    <p className="text-xs text-slate-500">RRHH, Consultora Sur</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex gap-1 mb-4 text-orange-400">
                                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"Poder acceder a los recibos desde el celular es una gran ventaja para nuestros empleados."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">CR</div>
                                <div>
                                    <p className="font-bold text-slate-800">Carlos Ruiz</p>
                                    <p className="text-xs text-slate-500">Gerente, Logística Express</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#0F2C4C] relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-secondary/5 skew-x-12 transform origin-top-right"></div>

                <div className="layout-container relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Empieza a optimizar tu nómina hoy</h2>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        Únete a las empresas que ya están ahorrando tiempo y dinero con NominaFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-all duration-200 bg-brand-secondary rounded-xl hover:bg-orange-400 shadow-lg shadow-orange-900/20"
                        >
                            Crear Cuenta Gratis
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-transparent border-2 border-white/20 rounded-xl hover:bg-white/10"
                        >
                            Agendar Demo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
