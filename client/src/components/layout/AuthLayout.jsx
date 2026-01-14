import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Branding */}
            <div className="bg-brand-primary w-full md:w-1/2 flex flex-col justify-center items-center p-10 text-white relative overflow-hidden">
                {/* Abstract Background Element (Smoke effect substitute) */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 text-center">
                    <Link to="/" className="text-6xl text-brand-secondary mb-6 block font-bold tracking-tight hover:opacity-90 transition">
                        NominaFlow
                    </Link>
                    <blockquote className="text-xl md:text-2xl font-light italic opacity-90 max-w-md mx-auto leading-relaxed">
                        "Simplificamos la gestión de nóminas para que tú te enfoques en hacer crecer tu negocio."
                    </blockquote>
                    <div className="mt-8 flex space-x-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary opacity-75"></div>
                        <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                        <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
