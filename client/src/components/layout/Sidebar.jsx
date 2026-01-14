import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Building, Users, FileText, Settings, X, Building2 } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Mis Empresas', path: '/dashboard/companies', icon: Building },
        { name: 'Empleados', path: '/dashboard/employees', icon: Users },
        { name: 'Nuevo Recibo', path: '/dashboard/receipts/new', icon: FileText },
        { name: 'Configuración', path: '/dashboard/settings', icon: Settings },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#0F2C4C] text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1e4570]">
                <Link to="/dashboard" className="flex items-center space-x-3" onClick={onClose}>
                    <div className="bg-brand-secondary p-2 rounded-lg">
                        <Building2 size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">NominaFlow</span>
                </Link>
                {/* Close button only visible on mobile */}
                <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose} // Auto-close on mobile when clicking link
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-[#E85D04] text-white shadow-lg shadow-orange-900/20'
                                : 'text-gray-300 hover:bg-[#1e4570] hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} className="mr-3" />
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info / Footer (Optional) */}
            <div className="p-4 border-t border-[#1e4570]">
                <div className="bg-[#1e4570] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Plan Actual</p>
                    <p className="text-sm font-bold text-white">Estudio Contable</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-30 shadow-xl">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

                {/* Drawer */}
                <div
                    className={`absolute inset-y-0 left-0 w-64 transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {sidebarContent}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
