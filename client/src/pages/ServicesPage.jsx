import React from 'react';
import { CheckCircle, Shield, Briefcase, Calculator, ArrowRight, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceSection = ({ title, description, benefits, icon: Icon, imageSrc, reversed }) => {
    return (
        <div className={`py-16 md:py-24 ${reversed ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="layout-container grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className={`order-2 ${reversed ? 'lg:order-2' : 'lg:order-1'} animate-in slide-in-from-bottom-8 duration-700`}>
                    <div className="inline-flex items-center p-3 rounded-xl bg-brand-primary/5 text-brand-primary mb-6">
                        <Icon size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <ul className="space-y-4 mb-8">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="text-brand-secondary mt-1 mr-3 flex-shrink-0" size={20} />
                                <span className="text-slate-700 font-medium">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Image / Illustration */}
                <div className={`order-1 ${reversed ? 'lg:order-1' : 'lg:order-2'} relative`}>
                    <div className="aspect-square md:aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        {/* Placeholder Content */}
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={title}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="text-center p-8">
                                <Icon size={64} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-400 font-medium">Ilustración 3D</p>
                            </div>
                        )}

                        {/* Floating Badge */}
                        <div className={`absolute ${reversed ? 'top-6 right-6' : 'bottom-6 left-6'} bg-white p-4 rounded-xl shadow-lg animate-float`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Estado</p>
                                    <p className="text-sm font-bold text-slate-800">Optimizado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesPage = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="bg-[#0F2C4C] text-white pt-24 pb-20 rounded-b-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-blue-500 rounded-full blur-[100px]"></div>
                </div>
                <div className="layout-container text-center relative z-10">
                    <span className="text-brand-secondary font-bold tracking-wider uppercase text-sm mb-4 block animate-in fade-in zoom-in duration-500 delay-100">
                        Nuestros Servicios
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        Soluciones Integrales para <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Tu Empresa</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        Desde la liquidación de sueldos hasta el cumplimiento legal, simplificamos cada paso de la gestión de tu capital humano.
                    </p>
                </div>
            </div>

            {/* Services List */}
            <section>
                <ServiceSection
                    title="Liquidación de Sueldos Automatizada"
                    description="Olvídate de las planillas de cálculo complejas y los errores manuales. Nuestro sistema procesa la nómina de manera precisa, teniendo en cuenta todas las variables legales y convenios colectivos vigentes."
                    icon={Calculator}
                    benefits={[
                        "Cálculo automático de haberes, deducciones y cargas sociales.",
                        "Generación instantánea de recibos de sueldo digitales.",
                        "Soporte para múltiples convenios y categorías laborales.",
                        "Exportación de archivos para bancos y F.931."
                    ]}
                    imageSrc="/hero_payroll_illustration.png" // Using Hero image as temporary placeholder/fallback
                    reversed={false}
                />

                <ServiceSection
                    title="Gestión de Recursos Humanos 360°"
                    description="Centraliza toda la información de tus colaboradores en un solo lugar. Desde el alta temprana hasta la gestión de licencias y vacaciones, mantén el control total de tu equipo."
                    icon={Briefcase}
                    benefits={[
                        "Legajos digitales completos y seguros.",
                        "Gestión de vacaciones, ausencias y licencias.",
                        "Historial laboral y documental centralizado.",
                        "Portal del empleado para autogestión de recibos."
                    ]}
                    imageSrc="" // Placeholder
                    reversed={true}
                />

                <ServiceSection
                    title="Cumplimiento Legal y Normativo"
                    description="Mantente siempre al día con las regulaciones laborales cambiantes. Nuestro sistema se actualiza constantemente para garantizar que tu empresa cumpla con todas las obligaciones legales."
                    icon={Shield}
                    benefits={[
                        "Actualizaciones automáticas según nuevas normativas.",
                        "Generación de Libro de Sueldos Digital.",
                        "Alertas de vencimientos y obligaciones.",
                        "Seguridad de datos bancaria y confidencialidad."
                    ]}
                    imageSrc="" // Placeholder
                    reversed={false}
                />
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-brand-bg">
                <div className="layout-container">
                    <div className="bg-gradient-to-br from-[#0F2C4C] to-[#1e4570] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Award size={200} />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para transformar tu gestión?</h2>
                            <p className="text-xl text-blue-100 mb-10">
                                Únete a más de 500 empresas que ya confían en NominaFlow para gestionar su nómina de manera eficiente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-all duration-200 bg-brand-secondary rounded-xl hover:bg-orange-400 hover:shadow-lg hover:-translate-y-1 shadow-orange-900/20"
                                >
                                    Comenzar Prueba Gratis
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-white/10 border-2 border-white/20 rounded-xl hover:bg-white/20"
                                >
                                    Contáctanos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
