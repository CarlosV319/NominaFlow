import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/authSlice';
import { Menu, ChevronDown, User, LogOut, AlignLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { activeCompany } = useAppSelector((state) => state.company);

    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-4 md:px-8 shadow-sm">
            {/* Left Section: Mobile Menu & Company Selector */}
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="md:hidden mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <AlignLeft size={24} />
                </button>

                <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                        <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                            <span className="font-bold text-sm">
                                {activeCompany ? activeCompany.razonSocial?.substring(0, 2).toUpperCase() : '+'}
                            </span>
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs text-gray-500 font-medium">Empresa Activa</p>
                            <h3 className="text-sm font-bold text-gray-800 flex items-center">
                                {activeCompany ? activeCompany.razonSocial : 'Seleccionar Empresa'}
                                <ChevronDown size={14} className="ml-1 text-gray-400" />
                            </h3>
                        </div>
                    </button>
                    {/* Placeholder for Company Dropdown */}
                </div>
            </div>

            {/* Right Section: User Profile */}
            <div className="relative">
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                >
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="h-9 w-9 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsUserMenuOpen(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden transform origin-top-right transition-all">
                            <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                <User size={16} className="mr-3 text-gray-400" />
                                Mi Perfil
                            </Link>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={16} className="mr-3" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default TopBar;
