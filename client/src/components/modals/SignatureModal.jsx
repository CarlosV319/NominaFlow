import React, { useState } from 'react';
import { X, PenTool, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const SignatureModal = ({ isOpen, onClose, receiptId, onSignSuccess }) => {
    const [signedInDisagreement, setSignedInDisagreement] = useState(false);
    const [disagreementComment, setDisagreementComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSign = async () => {
        if (signedInDisagreement && !disagreementComment.trim()) {
            toast.error('Debe ingresar un comentario si firma en disconformidad');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(`/receipts/${receiptId}/sign`, {
                signedInDisagreement,
                disagreementComment
            });
            toast.success(response.data.message || 'Recibo firmado correctamente');
            onSignSuccess(response.data.data);
            onClose();
        } catch (error) {
            console.error('Error al firmar:', error);
            toast.error(error.response?.data?.message || 'Error al firmar el recibo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <PenTool className="text-emerald-600" size={20} />
                        Firma Legal Electrónica
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed text-justify">
                        Al firmar este documento, declaras haber recibido el importe de la liquidación indicada en pago de tu remuneración correspondiente al período establecido, conforme a la ley vigente.
                    </p>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={signedInDisagreement}
                                onChange={(e) => setSignedInDisagreement(e.target.checked)}
                                className="mt-1 w-4 h-4 text-orange-600 rounded border-orange-300 focus:ring-orange-500"
                            />
                            <div>
                                <span className="block text-sm font-semibold text-orange-800">
                                    Firmar en Disconformidad (Res. MPyT 346/2019)
                                </span>
                                <span className="block text-xs text-orange-600 mt-1">
                                    Si no estás de acuerdo con los montos liquidados, marca esta casilla y deja tu comentario. Este quedará guardado de forma inmutable.
                                </span>
                            </div>
                        </label>
                        
                        {signedInDisagreement && (
                            <div className="mt-4">
                                <label className="block text-xs font-semibold text-orange-800 mb-1">
                                    Motivo de la disconformidad (Obligatorio)
                                </label>
                                <textarea
                                    value={disagreementComment}
                                    onChange={(e) => setDisagreementComment(e.target.value)}
                                    className="w-full text-sm p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    rows="3"
                                    placeholder="Ej: Faltan computar 2 horas extras del día..."
                                    required
                                ></textarea>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSign}
                        disabled={loading}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Firmando...' : 'Firmar Recibo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
