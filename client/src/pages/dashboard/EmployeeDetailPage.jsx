import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchEmployeeById } from '../../store/slices/employeeSlice';
import { fetchReceipts } from '../../store/slices/receiptSlice';
import { ArrowLeft, Edit2, Copy, Download, Eye, FileText, Plus, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const EmployeeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedEmployee, loading: empLoading } = useAppSelector((state) => state.employee);
    const { receipts, loading: receiptsLoading } = useAppSelector((state) => state.receipt);

    useEffect(() => {
        if (id) {
            dispatch(fetchEmployeeById(id));
            dispatch(fetchReceipts({ employeeId: id }));
        }
    }, [dispatch, id]);

    const handleCopyCBU = () => {
        if (selectedEmployee?.cbu) {
            navigator.clipboard.writeText(selectedEmployee.cbu);
            toast.success('CBU copiado al portapapeles');
        }
    };

    const handleDownloadPDF = async (receiptId, fileName) => {
        try {
            const response = await api.get(`/receipts/${receiptId}/pdf`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'recibo.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('PDF descargado');
        } catch (error) {
            toast.error('Error al descargar PDF');
        }
    };

    const calculateSeniority = (dateString) => {
        if (!dateString) return '';
        const start = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        let text = '';
        if (years > 0) text += `${years} año${years !== 1 ? 's' : ''}`;
        if (months > 0) text += `${years > 0 ? ' y ' : ''}${months} mes${months !== 1 ? 'es' : ''}`;
        if (years === 0 && months === 0) text = 'Menos de 1 mes';

        return text;
    };

    if (empLoading) return <div className="p-20 text-center">Cargando perfil...</div>;
    if (!selectedEmployee) return <div className="p-20 text-center">Empleado no encontrado.</div>;

    return (
        <div className="pb-20 max-w-7xl mx-auto">
            {/* Header nav */}
            <div className="mb-8">
                <Link to="/dashboard/employees" className="inline-flex items-center text-gray-500 hover:text-[#0F2C4C] transition gap-2 mb-4">
                    <ArrowLeft size={18} /> Volver a la Lista
                </Link>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="font-bold text-[#0F2C4C] text-3xl">Legajo Digital</h1>
                        <p className="text-gray-500">Gestión detalle del colaborador</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Identity Card (1/3) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#0F2C4C] to-[#1C3E61]"></div>

                        <div className="relative flex flex-col items-center mt-8">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mb-4">
                                <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-2xl font-bold text-[#0F2C4C]">
                                    {selectedEmployee.nombre[0]}{selectedEmployee.apellido[0]}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-[#0F2C4C] text-center">{selectedEmployee.nombre} {selectedEmployee.apellido}</h2>
                            <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                Activo
                            </span>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Legajo</p>
                                <p className="text-lg font-mono font-bold text-gray-800">{selectedEmployee.legajo}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">CUIL</p>
                                <p className="text-gray-700 font-medium">{selectedEmployee.cuil}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Ingreso</p>
                                    <p className="text-gray-700 text-sm">{new Date(selectedEmployee.fechaIngreso).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Antigüedad</p>
                                    <p className="text-blue-600 font-medium text-xs">
                                        {calculateSeniority(selectedEmployee.fechaIngreso)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Cargo / Puesto</p>
                                <p className="text-gray-700 font-medium">{selectedEmployee.cargo}</p>
                                <p className="text-xs text-gray-500 mt-1">{selectedEmployee.modalidadContratacion}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Datos Bancarios</p>
                                <p className="text-sm text-gray-800 font-medium">{selectedEmployee.banco || 'Banco No Esp.'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded select-all">
                                        {selectedEmployee.cbu}
                                    </p>
                                    <button onClick={handleCopyCBU} className="text-gray-400 hover:text-blue-600 p-1" title="Copiar CBU">
                                        <Copy size={14} />
                                    </button>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-2 border border-[#0F2C4C] text-[#0F2C4C] rounded-lg text-sm font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                <Edit2 size={16} /> Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Receipt History (2/3) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={20} className="text-[#0F2C4C]" /> Recibos Emitidos
                            </h3>
                            <Link to="/dashboard/receipts/new" className="text-xs font-bold text-[#E85D04] hover:underline flex items-center gap-1">
                                <Plus size={14} /> Nuevo Recibo
                            </Link>
                        </div>

                        {receiptsLoading ? (
                            <div className="p-10 text-center text-gray-400">Cargando historial...</div>
                        ) : receipts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-80 text-center p-8">
                                <div className="bg-orange-50 p-6 rounded-full mb-4">
                                    <FileText size={48} className="text-orange-200" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-700 mb-2">Aún no hay recibos</h4>
                                <p className="text-gray-500 mb-6 max-w-xs">Genera la primera liquidación para este empleado para empezar su historial.</p>
                                <Link
                                    to="/dashboard/receipts/new"
                                    className="px-6 py-3 bg-[#E85D04] text-white rounded-xl font-bold shadow-lg hover:bg-[#d15403] transition"
                                >
                                    Generar Primer Recibo
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Periodo</th>
                                            <th className="px-6 py-4 text-right">Bruto</th>
                                            <th className="px-6 py-4 text-right">Descuentos</th>
                                            <th className="px-6 py-4 text-right">Neto a Cobrar</th>
                                            <th className="px-6 py-4 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {receipts.map((receipt) => (
                                            <tr key={receipt._id} className="hover:bg-blue-50/30 transition group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-[#0F2C4C]">{String(receipt.periodo.mes).padStart(2, '0')}/{receipt.periodo.anio}</div>
                                                    <div className="text-xs text-gray-400">Liquidación Mensual</div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-gray-600">
                                                    ${receipt.totales.totalBruto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-red-500">
                                                    -${receipt.totales.totalDescuentos.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 border-l-2 border-transparent group-hover:border-[#E85D04]">
                                                    ${receipt.totales.totalNeto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            to={`/dashboard/receipts/${receipt._id}/preview`}
                                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                                                            title="Ver Detalle"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDownloadPDF(receipt._id, `recibo-${receipt.periodo.mes}-${receipt.periodo.anio}.pdf`)}
                                                            className="p-2 text-gray-400 hover:text-[#E85D04] rounded-lg hover:bg-orange-50 transition"
                                                            title="Descargar PDF"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDetailPage;
