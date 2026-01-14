import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchReceipts } from '../../store/slices/receiptSlice';
import { Link } from 'react-router-dom';
import { FileText, Plus, Download, Search, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReceiptListPage = () => {
    const dispatch = useAppDispatch();
    const { activeCompany } = useAppSelector((state) => state.company);
    const { receipts, loading, error } = useAppSelector((state) => state.receipt);

    // Filters
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchReceipts({
                companyId: activeCompany._id,
                mes: month,
                anio: year
            }));
        }
    }, [dispatch, activeCompany, month, year]);

    const handleDownload = (id) => {
        // Placeholder for PDF download
        toast.success(`Descargando recibo...`);
    };

    if (!activeCompany) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-gray-600">Selecciona una empresa</h2>
                <p className="text-gray-400">Para ver los recibos emitidos.</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-bold text-[#0F2C4C]">Recibos de Sueldo</h1>
                    <p className="text-gray-500 mt-1">Historial de liquidaciones de {activeCompany.razonSocial}</p>
                </div>
                <Link
                    to="/dashboard/receipts/new"
                    className="flex items-center justify-center px-6 py-3 bg-[#E85D04] text-white rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-[#d15403] hover:-translate-y-1 transition-all"
                >
                    <Plus size={20} className="mr-2" />
                    Nuevo Recibo
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={18} />
                    <span className="font-medium text-sm">Periodo:</span>
                </div>
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Cargando recibos...</div>
            ) : receipts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="bg-gray-50 p-4 rounded-full inline-block mb-3">
                        <FileText size={32} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No hay recibos generados para este periodo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Empleado</th>
                                <th className="px-6 py-4">CUIL</th>
                                <th className="px-6 py-4">Cargo</th>
                                <th className="px-6 py-4 text-right">Neto Pagado</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {receipts.map((receipt) => (
                                <tr key={receipt._id} className="hover:bg-blue-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#0F2C4C]">{receipt.employeeSnapshot.apellido}, {receipt.employeeSnapshot.nombre}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{receipt.employeeSnapshot.cuil}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{receipt.employeeSnapshot.cargo}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-[#E85D04]">
                                        ${receipt.totales.totalNeto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDownload(receipt._id)}
                                            className="p-2 text-gray-400 hover:text-[#0F2C4C] rounded-lg hover:bg-gray-100 transition"
                                            title="Descargar PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReceiptListPage;
