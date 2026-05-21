import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchUsers, updateUserAsAdmin, deleteUserAsAdmin } from '../../store/slices/adminSlice';
import { Users, Shield, CreditCard, Trash2, Edit2, ShieldCheck, Mail, Save, X, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const SuperAdminPage = () => {
    const dispatch = useAppDispatch();
    const { users, loading, error } = useAppSelector((state) => state.admin);
    const { user: currentUser } = useAppSelector((state) => state.auth);

    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        plan: '',
        subscriptionStatus: '',
        role: ''
    });

    useEffect(() => {
        if (currentUser?.role === 'SUPERADMIN') {
            dispatch(fetchUsers());
        }
    }, [dispatch, currentUser]);

    if (currentUser?.role !== 'SUPERADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            plan: user.plan || 'INICIAL',
            subscriptionStatus: user.subscriptionStatus || 'ACTIVE',
            role: user.role || 'ADMIN'
        });
    };

    const handleSaveEdit = async () => {
        try {
            await dispatch(updateUserAsAdmin({ id: editingUser._id, data: editForm })).unwrap();
            toast.success('Usuario actualizado correctamente');
            setEditingUser(null);
        } catch (err) {
            toast.error(err || 'Error al actualizar');
        }
    };

    const handleDeleteUser = async (id, email) => {
        if (window.confirm(`¿Estás SEGURO de eliminar al usuario ${email}? Esto borrará todas sus empresas, empleados y recibos irremediablemente.`)) {
            try {
                await dispatch(deleteUserAsAdmin(id)).unwrap();
                toast.success('Usuario eliminado');
            } catch (err) {
                toast.error(err || 'Error al eliminar');
            }
        }
    };

    const getPlanBadgeColor = (plan) => {
        switch (plan) {
            case 'PROFESIONAL': return 'bg-blue-100 text-blue-800';
            case 'ESTUDIO': return 'bg-purple-100 text-purple-800';
            case 'CORPORATE': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800'; // INICIAL
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'PAST_DUE': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-secondary/10 rounded-lg">
                    <ShieldCheck size={24} className="text-brand-secondary" />
                </div>
                <div>
                    <h1 className="text-[14px] font-bold text-slate-800">Administración SaaS</h1>
                    <p className="text-[10px] text-slate-500">Control total sobre los usuarios y suscripciones de la plataforma.</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded-lg">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                                <th className="p-3 font-bold">Usuario</th>
                                <th className="p-3 font-bold text-center">Rol</th>
                                <th className="p-3 font-bold text-center">Plan</th>
                                <th className="p-3 font-bold text-center">Estado</th>
                                <th className="p-3 font-bold text-center">Uso (Emp/Rec)</th>
                                <th className="p-3 font-bold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500 text-[10px]">Cargando usuarios...</td>
                                </tr>
                            ) : (users || []).length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500 text-[10px]">No hay usuarios registrados.</td>
                                </tr>
                            ) : (
                                (users || []).map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition">
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[12px]">
                                                    {(user.firstName?.[0] || user.name?.[0] || 'U').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-[12px]">{user.firstName || user.name} {user.lastName || ''}</p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${user.role === 'SUPERADMIN' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.role === 'SUPERADMIN' && <Shield size={10} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPlanBadgeColor(user.plan)}`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeColor(user.subscriptionStatus)}`}>
                                                {user.subscriptionStatus}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center text-[10px] text-slate-600 font-mono">
                                            {user.stats?.companies || 0} E / {user.stats?.receipts || 0} R
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                                    title="Editar Suscripción"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user._id, user.email)}
                                                    disabled={user._id === currentUser._id}
                                                    className={`p-1.5 rounded transition ${user._id === currentUser._id ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                                                    title="Eliminar Usuario"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-[12px] flex items-center gap-2">
                                <Settings size={16} className="text-brand-primary" />
                                Editar {editingUser.email}
                            </h3>
                            <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-1">Plan de Suscripción</label>
                                <select
                                    value={editForm.plan}
                                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-primary outline-none text-[10px]"
                                >
                                    <option value="INICIAL">INICIAL</option>
                                    <option value="PROFESIONAL">PROFESIONAL</option>
                                    <option value="ESTUDIO">ESTUDIO</option>
                                    <option value="CORPORATE">CORPORATE</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-1">Estado de Suscripción</label>
                                <select
                                    value={editForm.subscriptionStatus}
                                    onChange={(e) => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-primary outline-none text-[10px]"
                                >
                                    <option value="ACTIVE">Activo (ACTIVE)</option>
                                    <option value="PAST_DUE">En Mora (PAST_DUE)</option>
                                    <option value="CANCELED">Cancelado (CANCELED)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-1">Rol en el Sistema</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    disabled={editingUser._id === currentUser._id}
                                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-primary outline-none text-[10px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="ADMIN">Usuario Normal (ADMIN)</option>
                                    <option value="ACCOUNTANT">Contador (ACCOUNTANT)</option>
                                    <option value="SUPERADMIN">Super Admin (SaaS Control)</option>
                                </select>
                                {editingUser._id === currentUser._id && (
                                    <p className="text-[9px] text-orange-500 mt-1">No puedes cambiar tu propio rol.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 rounded transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                className="px-4 py-1.5 text-[10px] font-bold bg-brand-primary text-white hover:bg-blue-900 rounded shadow transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Save size={14} /> {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminPage;
