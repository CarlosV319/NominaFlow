import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Zap } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0F2C4C] text-slate-300 py-16 border-t border-slate-800">
            <div className="layout-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="space-y-6">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-brand-secondary to-orange-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Zap size={24} className="text-white" fill="currentColor" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">NominaFlow</span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed">
                        Simplificando la gestión de nómina para empresas modernas. Tecnología, seguridad y eficiencia en una sola plataforma.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-300"><Twitter size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-300"><Facebook size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-300"><Instagram size={18} /></a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-300"><Linkedin size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h3>
                    <ul className="space-y-4">
                        <li><Link to="/" className="hover:text-brand-secondary transition-colors">Inicio</Link></li>
                        <li><Link to="/services" className="hover:text-brand-secondary transition-colors">Servicios</Link></li>
                        <li><Link to="/planes" className="hover:text-brand-secondary transition-colors">Planes y Precios</Link></li>
                        <li><Link to="/about" className="hover:text-brand-secondary transition-colors">Quienes Somos</Link></li>
                        <li><Link to="/contact" className="hover:text-brand-secondary transition-colors">Contacto</Link></li>
                    </ul>
                </div>

                {/* Legal & Support */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Soporte y Legal</h3>
                    <ul className="space-y-4">
                        <li><Link to="/#faq" className="hover:text-brand-secondary transition-colors">Preguntas Frecuentes</Link></li>
                        <li><a href="#" className="hover:text-brand-secondary transition-colors">Términos y Condiciones</a></li>
                        <li><a href="#" className="hover:text-brand-secondary transition-colors">Política de Privacidad</a></li>
                        <li><a href="#" className="hover:text-brand-secondary transition-colors">Centro de Ayuda</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-6">Contáctanos</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Mail size={20} className="text-brand-secondary mt-1 shrink-0" />
                            <span>contacto@nominaflow.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone size={20} className="text-brand-secondary mt-1 shrink-0" />
                            <span>+54 11 1234-5678</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin size={20} className="text-brand-secondary mt-1 shrink-0" />
                            <span>Av. Corrientes 1234, CABA<br />Buenos Aires, Argentina</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="layout-container mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                <p>&copy; {currentYear} NominaFlow. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
