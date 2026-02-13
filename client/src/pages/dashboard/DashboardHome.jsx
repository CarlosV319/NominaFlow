import React, { useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchReceipts } from '../../store/slices/receiptSlice';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, Plus, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

const DashboardHome = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { activeCompany } = useAppSelector((state) => state.company);
    const { employees } = useAppSelector((state) => state.employee);
    const { receipts } = useAppSelector((state) => state.receipt);
    const { plan, usage, isLoading } = useSubscription();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchEmployees(activeCompany._id));
            // Fetch receipts for the current company (snapshot of recent activity)
            dispatch(fetchReceipts({ companyId: activeCompany._id }));
        }
    }, [activeCompany, dispatch]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando panel...</div>;

    // Calculate usage percentages
    const companyUsage = usage?.companies ? (usage.companies.used / usage.companies.limit) * 100 : 0;
    const receiptUsage = usage?.receipts ? (usage.receipts.used / usage.receipts.limit) * 100 : 0;
    const isFree = plan?.name === 'FREE' || plan?.name === 'Inicial';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {getGreeting()}, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Aquí tienes el resumen de tu actividad hoy.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${isFree ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                    <span className="text-sm font-medium text-slate-600">Plan: <span className="font-bold">{plan?.name}</span></span>
                </div>
            </div>

            {/* 2. Global Stats Cards (Subscription Usage) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Companies Usage */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 size={64} className="text-brand-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Empresas</p>
                        <h3 className="text-2xl font-bold text-slate-800">
                            {usage?.companies?.used} <span className="text-sm text-slate-400 font-normal">/ {usage?.companies?.isUnlimited ? '∞' : usage?.companies?.limit}</span>
                        </h3>
                        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${companyUsage > 90 ? 'bg-red-500' : 'bg-brand-secondary'}`}
                                style={{ width: `${Math.min(companyUsage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Receipts Usage */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={64} className="text-brand-secondary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recibos (Mes)</p>
                        <h3 className="text-2xl font-bold text-slate-800">
                            {usage?.receipts?.used} <span className="text-sm text-slate-400 font-normal">/ {usage?.receipts?.limit}</span>
                        </h3>
                        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full ${receiptUsage > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(receiptUsage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Active Context Card */}
                <div className="bg-[#0F2C4C] text-white p-5 rounded-xl border border-[#1e4570] shadow-sm relative overflow-hidden col-span-1 md:col-span-2">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={80} className="text-white" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Empresa Activa</p>
                            {activeCompany ? (
                                <>
                                    <h3 className="text-xl font-bold mb-1">{activeCompany.razonSocial}</h3>
                                    <p className="text-sm text-white/80">{activeCompany.cuit}</p>
                                </>
                            ) : (
                                <div className="flex items-center text-amber-300 gap-2 mb-2">
                                    <AlertTriangle size={18} />
                                    <h3 className="text-lg font-bold">Ninguna seleccionada</h3>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            {activeCompany ? (
                                <Link to="/dashboard/companies" className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition">
                                    Cambiar Empresa
                                </Link>
                            ) : (
                                <Link to="/dashboard/companies" className="text-xs font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 px-3 py-1.5 rounded transition">
                                    Seleccionar Empresa
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Detailed Stats (If Company Selected) */}
            {activeCompany ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800">Recibos Recientes</h3>
                                <Link to="/dashboard/receipts" className="text-xs text-brand-secondary font-bold hover:underline flex items-center">
                                    Ver todos <ArrowRight size={12} className="ml-1" />
                                </Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {receipts && receipts.length > 0 ? (
                                    receipts.slice(0, 5).map((receipt) => (
                                        <div key={receipt._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-slate-100 p-2 rounded-lg">
                                                    <FileText size={18} className="text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {receipt.periodo.mes}/{receipt.periodo.anio}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {receipt.employeeSnapshot.nombre} {receipt.employeeSnapshot.apellido}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-700">
                                                    ${receipt.totales.totalNeto.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-slate-400">Neto</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No hay recibos generados recientemente.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Quick Actions & Employee Summary */}
                    <div className="space-y-6">
                        {/* Employees Card */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Users size={20} className="text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Empleados</h3>
                                </div>
                                <span className="text-2xl font-bold text-slate-800">{employees.length}</span>
                            </div>
                            <div className="space-y-2">
                                <Link
                                    to="/dashboard/employees"
                                    className="block w-full py-2 text-center text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Ver Lista
                                </Link>
                                <button className="block w-full py-2 text-center text-sm font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition">
                                    + Agregar Empleado
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-brand-secondary to-orange-600 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="font-bold mb-4">Acciones Rápidas</h3>
                            <Link
                                to="/dashboard/receipts/new"
                                className="flex items-center justify-between bg-white/20 hover:bg-white/30 p-3 rounded-lg transition mb-3 cursor-pointer"
                            >
                                <span className="font-medium text-sm">Nuevo Recibo</span>
                                <Plus size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty State if no company selected
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
                    <div className="max-w-md mx-auto">
                        <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Selecciona una Empresa</h3>
                        <p className="text-slate-500 mb-6">
                            Para ver estadísticas detalladas, empleados y recibos recientes, selecciona una empresa activa.
                        </p>
                        <Link
                            to="/dashboard/companies"
                            className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-[#1a4b80] transition"
                        >
                            Ir a Mis Empresas
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
