import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Quienes Somos', path: '/about' },
        { name: 'Nuestro Servicio', path: '/services' },
        { name: 'Contacto', path: '/contact' },
    ];

    return (
        <nav className="bg-brand-primary text-brand-bg shadow-md sticky top-0 z-50">
            <div className="layout-container h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-bold tracking-wide hover:text-brand-secondary transition-colors duration-300">
                    NominaFlow
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-medium hover:text-brand-secondary transition-colors duration-300"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Auth Buttons Desktop */}
                    <div className="ml-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-xs opacity-80">Hola, {user?.firstName}</span>
                                <Link
                                    to="/dashboard"
                                    className="bg-brand-secondary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition shadow-sm"
                                >
                                    Ir al Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm border border-brand-bg/30 px-3 py-2 rounded-md hover:bg-white/10 transition"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-brand-secondary text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90 transition shadow-sm transform hover:-translate-y-0.5"
                            >
                                Inicio de Sesión
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="focus:outline-none text-brand-bg">
                        {isOpen ? (
                            // X Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-brand-primary border-t border-brand-bg/10 absolute w-full left-0">
                    <div className="px-5 pt-4 pb-6 space-y-3 flex flex-col">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block text-base font-medium hover:text-brand-secondary transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-brand-bg/10 pt-4 mt-2">
                            {isAuthenticated ? (
                                <div className="flex flex-col space-y-3">
                                    <span className="text-sm opacity-80 mb-1">Usuario: {user?.firstName}</span>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-brand-secondary text-white px-4 py-2 rounded-md text-center font-semibold"
                                    >
                                        Ir al Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-left py-2 hover:text-brand-secondary"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-brand-secondary text-white px-4 py-2 rounded-md text-center font-semibold block w-full"
                                >
                                    Inicio de Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
