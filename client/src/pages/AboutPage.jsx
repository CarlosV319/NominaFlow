import React from 'react';
import { Target, Users, Shield, TrendingUp, Heart, Globe } from 'lucide-react';

const AboutPage = () => {
    const stats = [
        { label: 'Empresas Confían', value: '500+' },
        { label: 'Recibos Generados', value: '10k+' },
        { label: 'Años de Experiencia', value: '5+' },
        { label: 'Países', value: '3' },
    ];

    const values = [
        {
            icon: Shield,
            title: 'Seguridad',
            description: 'Protegemos la información sensible de tu empresa y empleados con los más altos estándares de seguridad.'
        },
        {
            icon: TrendingUp,
            title: 'Innovación',
            description: 'Buscamos constantemente nuevas formas de simplificar procesos complejos mediante tecnología de punta.'
        },
        {
            icon: Heart,
            title: 'Empatía',
            description: 'Diseñamos pensando en las personas. Entendemos que detrás de cada recibo de sueldo hay una familia.'
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-[#0F2C4C] text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-secondary rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                </div>

                <div className="layout-container relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        Innovación en cada <br />
                        <span className="text-brand-secondary">Liquidación</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-100">
                        NominaFlow nació con una misión clara: transformar la gestión de nómina de un dolor de cabeza a una ventaja competitiva.
                    </p>
                </div>
            </section>

            {/* Our Story / Mission */}
            <section className="py-20 md:py-28">
                <div className="layout-container grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-primary/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-secondary/10 rounded-full blur-xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2940"
                            alt="Equipo trabajando"
                            className="relative rounded-2xl shadow-2xl shadow-blue-900/20 grayscale hover:grayscale-0 transition-all duration-700 transform hover:scale-[1.02]"
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-sm font-bold border border-brand-primary/10">
                            <Globe size={16} className="mr-2" />
                            Nuestra Historia
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                            Simplificando lo complejo para que tú puedas crecer.
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Fundada en 2024, NominaFlow surgió al observar las dificultades que enfrentaban las PyMEs para gestionar su nómina: sistemas obsoletos, errores costosos y falta de soporte.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Decidimos crear una solución que combinara la potencia de un sistema enterprise con la simplicidad de una app moderna. Hoy, ayudamos a cientos de empresas a pagar a tiempo y sin errores.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="py-16 bg-brand-bg border-y border-slate-200">
                <div className="layout-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <h3 className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {stat.value}
                                </h3>
                                <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="layout-container">
                    <div className="text-center mb-16">
                        <span className="text-brand-secondary font-bold uppercase tracking-wider text-sm mb-2 block">Nuestros Valores</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Lo que nos impulsa</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((val, index) => (
                            <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-2">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-primary mb-6">
                                    <val.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">{val.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {val.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission/Vision Split */}
            <section className="py-20 bg-[#0F2C4C] text-white">
                <div className="layout-container grid md:grid-cols-2 gap-12">
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <Target size={48} className="text-brand-secondary mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Empoderar a las empresas con herramientas tecnológicas que simplifiquen la gestión del talento, permitiéndoles enfocarse en lo que realmente importa: su gente.
                        </p>
                    </div>
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <Globe size={48} className="text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Ser la plataforma de referencia en Latinoamérica para la gestión integral de recursos humanos, estableciendo un nuevo estándar de eficiencia y transparencia.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
