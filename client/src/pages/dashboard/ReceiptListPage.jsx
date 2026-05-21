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
                <h2 className="text-[12px] font-bold text-gray-600">Selecciona una empresa</h2>
                <p className="text-[10px] text-gray-400">Para ver los recibos emitidos.</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="font-bold text-[12px] text-[#0F2C4C]">Recibos de Sueldo</h1>
                    <p className="text-[10px] text-gray-500 mt-1">Historial de liquidaciones de {activeCompany.razonSocial}</p>
                </div>
                <Link
                    to="/dashboard/receipts/new"
                    className="flex items-center justify-center px-4 py-2 bg-[#E85D04] text-[10px] text-white rounded-lg font-bold shadow-lg shadow-orange-900/20 hover:bg-[#d15403] hover:-translate-y-1 transition-all"
                >
                    <Plus size={14} className="mr-1.5" />
                    Nuevo Recibo
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span className="font-medium text-[10px]">Periodo:</span>
                </div>
                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="py-1.5 px-2 border border-gray-300 rounded text-[10px] focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('es-ES', { month: 'long' })}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="py-1.5 px-2 border border-gray-300 rounded text-[10px] w-20 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-20 text-[10px] text-gray-500">Cargando recibos...</div>
            ) : receipts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="bg-gray-50 p-3 rounded-full inline-block mb-3">
                        <FileText size={24} className="text-gray-300" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">No hay recibos generados para este periodo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-3">Empleado</th>
                                <th className="px-4 py-3">CUIL</th>
                                <th className="px-4 py-3">Cargo</th>
                                <th className="px-4 py-3 text-right">Neto Pagado</th>
                                <th className="px-4 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {receipts.map((receipt) => (
                                <tr key={receipt._id} className="hover:bg-blue-50/50 transition">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-[12px] text-[#0F2C4C]">{receipt.employeeSnapshot.apellido}, {receipt.employeeSnapshot.nombre}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-[10px]">{receipt.employeeSnapshot.cuil}</td>
                                    <td className="px-4 py-3 text-gray-600 text-[10px]">{receipt.employeeSnapshot.cargo}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-[12px] text-[#E85D04]">
                                        ${receipt.totales.totalNeto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDownload(receipt._id)}
                                            className="p-1.5 text-gray-400 hover:text-[#0F2C4C] rounded hover:bg-gray-100 transition"
                                            title="Descargar PDF"
                                        >
                                            <Download size={14} />
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
