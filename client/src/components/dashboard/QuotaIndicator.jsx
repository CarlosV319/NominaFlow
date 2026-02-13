import React, { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { Zap, AlertTriangle } from 'lucide-react';
import UpgradeModal from '../modals/UpgradeModal';

const QuotaIndicator = () => {
    const { plan, usage, isLoading } = useSubscription();
    const [showModal, setShowModal] = useState(false);

    if (isLoading) return <div className="p-4 text-center text-xs text-gray-500">Cargando suscripción...</div>;
    if (!plan || !usage) return null;

    const renderProgressBar = (label, current, max, isUnlimited = false) => {
        if (isUnlimited) {
            return (
                <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">{label}</span>
                        <span className="text-emerald-600 font-bold">Ilimitado</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
                    </div>
                </div>
            );
        }

        const percentage = Math.min((current / max) * 100, 100);
        let colorClass = 'bg-emerald-500';
        if (percentage >= 90) colorClass = 'bg-red-500';
        else if (percentage >= 75) colorClass = 'bg-yellow-500';

        return (
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{label}</span>
                    <span className={`font-bold ${percentage >= 90 ? 'text-red-600' : 'text-slate-700'}`}>
                        {current} / {max}
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                        className={`${colorClass} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    const isFree = plan.name === 'FREE';

    return (
        <div className="mx-4 mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tu Plan</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isFree ? 'bg-slate-200 text-slate-600' : 'bg-[#0F2C4C] text-white'}`}>
                    {plan.name}
                </span>
            </div>

            {renderProgressBar('Empresas', usage.companies.used, usage.companies.limit, usage.companies.isUnlimited)}
            {renderProgressBar('Recibos (Mes)', usage.receipts.used, usage.receipts.limit, false)}

            {isFree && (
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold py-2 rounded hover:from-amber-600 hover:to-orange-700 transition"
                >
                    <Zap size={14} fill="currentColor" /> Actualizar a PRO
                </button>
            )}

            <UpgradeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default QuotaIndicator;
