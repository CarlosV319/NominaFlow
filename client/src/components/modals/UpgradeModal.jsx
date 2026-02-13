import React from 'react';
import { X, Check } from 'lucide-react';
import { plans } from '../../config/plans';

const UpgradeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8 relative overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#0F2C4C] p-6 text-center text-white relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/50 hover:text-white transition bg-white/10 p-1 rounded-full"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold mb-2">Resultados que escalan contigo</h2>
                    <p className="text-white/80 text-sm max-w-2xl mx-auto">
                        Actualiza tu plan para desbloquear más empresas, recibos y funcionalidades exclusivas.
                    </p>
                </div>

                {/* Body - Scrollable Plans Grid */}
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`rounded-xl border flex flex-col h-full bg-white relative transition-all duration-200 ${plan.recommended
                                        ? 'border-brand-secondary ring-2 ring-brand-secondary/20 shadow-xl scale-[1.02] z-10'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-brand-secondary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                            Recomendado
                                        </span>
                                    </div>
                                )}

                                <div className="p-5 text-center border-b border-slate-50">
                                    <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                                    <p className="text-[10px] font-bold text-brand-secondary uppercase tracking-tight mb-2">{plan.tagline}</p>
                                    <div className="flex justify-center items-baseline text-slate-900 mb-1">
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-snug min-h-[2.5em]">{plan.description}</p>
                                </div>

                                <div className="p-5 flex-grow bg-slate-50/50">
                                    <div className="space-y-3">
                                        {/* Limits Highlight */}
                                        <div className="space-y-1.5 mb-4 pb-4 border-b border-slate-200 border-dashed">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Empresas</span>
                                                <span className="font-bold text-slate-800">{plan.limits.companies}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-500">Recibos/mes</span>
                                                <span className="font-bold text-slate-800">{plan.limits.receipts}</span>
                                            </div>
                                        </div>

                                        <ul className="space-y-2">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-xs text-slate-700">
                                                    <Check size={14} className="text-green-500 mr-2 shrink-0 mt-0.5" />
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-4 mt-auto border-t border-slate-100">
                                    <button
                                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${plan.recommended
                                                ? 'bg-brand-secondary text-white hover:bg-orange-600 shadow-orange-200'
                                                : 'bg-slate-800 text-white hover:bg-slate-900'
                                            }`}
                                    >
                                        {plan.buttonText}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-8">
                        ¿Dudas? Contáctanos a soporte@nominaflow.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
