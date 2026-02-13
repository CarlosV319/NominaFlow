import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { updateProfile, updatePassword } from '../../store/slices/authSlice';
import { useSubscription } from '../../hooks/useSubscription';
import { User, Shield, CreditCard, Save, Lock, Mail, UserCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpgradeModal from '../../components/modals/UpgradeModal';

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const { user, loading } = useAppSelector((state) => state.auth);
    const { plan, usage } = useSubscription(); // Assuming these exist from subscription hook

    const [activeTab, setActiveTab] = useState('profile');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile(profileData));
        if (updateProfile.fulfilled.match(result)) {
            toast.success('Perfil actualizado correctamente');
        } else {
            toast.error(result.payload || 'Error al actualizar perfil');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Las nuevas contraseñas no coinciden');
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error('La contraseña debe tener al menos 6 caracteres');
        }

        const result = await dispatch(updatePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        }));

        if (updatePassword.fulfilled.match(result)) {
            toast.success('Contraseña actualizada');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            toast.error(result.payload || 'Error al actualizar contraseña');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Mi Perfil', icon: User },
        { id: 'subscription', label: 'Suscripción', icon: CreditCard },
        { id: 'security', label: 'Seguridad', icon: Shield },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
                <p className="text-slate-500">Administra tu cuenta, plan y preferencias de seguridad.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-white text-brand-primary shadow-sm border border-slate-200'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    <Icon size={18} className={`mr-3 ${activeTab === tab.id ? 'text-brand-secondary' : 'text-slate-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center mb-6 pb-6 border-b border-slate-100">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mr-4">
                                    <UserCircle size={40} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Información Personal</h2>
                                    <p className="text-sm text-slate-500">Actualiza tus datos de identificación.</p>
                                </div>
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-[#1a4b80] transition flex items-center shadow-lg shadow-blue-900/10 disabled:opacity-50"
                                >
                                    <Save size={18} className="mr-2" />
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* SUBSCRIPTION TAB */}
                    {activeTab === 'subscription' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-6 pb-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Plan Actual</h2>
                                    <p className="text-sm text-slate-500">Administra tu suscripción y límites.</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${plan?.name === 'FREE' ? 'bg-slate-100 text-slate-600' : 'bg-brand-secondary/10 text-brand-secondary'
                                    }`}>
                                    {plan?.name || 'Cargando...'}
                                </span>
                            </div>

                            <div className="space-y-8">
                                {/* Companies Usage */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-600">Empresas Activas</span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {usage?.companies?.used} / {usage?.companies?.isUnlimited ? '∞' : usage?.companies?.limit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                        <div
                                            className="bg-brand-primary h-2.5 rounded-full"
                                            style={{ width: `${Math.min(((usage?.companies?.used || 0) / (usage?.companies?.limit || 1)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Receipts Usage */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-600">Recibos Generados (Este mes)</span>
                                        <span className="text-sm font-bold text-slate-800">
                                            {usage?.receipts?.used} / {usage?.receipts?.limit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                                        <div
                                            className="bg-brand-secondary h-2.5 rounded-full"
                                            style={{ width: `${Math.min(((usage?.receipts?.used || 0) / (usage?.receipts?.limit || 1)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Upgrade CTA */}
                                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="font-bold text-lg mb-1">¿Necesitas más potencia?</h3>
                                        <p className="text-white/70 text-sm">Actualiza a un plan superior para desbloquear empresas ilimitadas y más recibos.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="px-6 py-2 bg-brand-secondary text-white font-bold rounded-lg hover:bg-orange-600 transition shadow-lg shadow-orange-900/20 whitespace-nowrap"
                                    >
                                        Ver Planes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800">Seguridad</h2>
                                <p className="text-sm text-slate-500">Actualiza tu contraseña.</p>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña Actual</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nueva Contraseña</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition flex items-center disabled:opacity-50"
                                >
                                    <Save size={18} className="mr-2" />
                                    Actualizar Contraseña
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default SettingsPage;
