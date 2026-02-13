
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import api from '../../api/axios';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatCurrency, numberToWords } from '../../utils/formatters';

const ReceiptPreviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activeCompany } = useAppSelector((state) => state.company);

    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pdfLoading, setPdfLoading] = useState(false);

    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                // Fetch all and filter client-side as per current limitations
                const { data } = await api.get(`/receipts?companyId=${activeCompany?._id}`);
                const found = data.data.find(r => r._id === id);

                if (found) {
                    setReceipt(found);
                } else {
                    toast.error('Recibo no encontrado');
                    navigate('/dashboard/receipts');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error al cargar el recibo');
            } finally {
                setLoading(false);
            }
        };

        if (activeCompany) {
            fetchReceiptData();
        }
    }, [id, activeCompany, navigate]);

    const handleDownloadPDF = async () => {
        try {
            setPdfLoading(true);
            const response = await api.get(`/receipts/${id}/pdf`, {
                responseType: 'blob',
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extract filename from header if possible, or use default
            const contentDisposition = response.headers['content-disposition'];
            let fileName = `recibo-${id}.pdf`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('PDF descargado correctamente');
        } catch (error) {
            console.error('Error downloading PDF:', error);
            toast.error('Error al descargar el PDF');
        } finally {
            setPdfLoading(false);
        }
    };

    const handlePrint = async () => {
        // Use backend PDF generation for "Print" as well, it ensures the same output as Download
        await handleDownloadPDF();
    };

    // Helper component for the receipt content
    const ReceiptTemplate = ({ type }) => {
        const isOriginal = type === 'ORIGINAL';
        const label = isOriginal ? 'ORIGINAL - EMPLEADO' : 'DUPLICADO - EMPLEADOR';

        return (
            <div className="w-full h-full p-2 border-r-2 border-dashed border-slate-300 last:border-r-0">
                <div style={{ transform: 'scale(0.95)', transformOrigin: 'top center' }} className="h-full w-full">
                    <div className="w-full h-full flex flex-col justify-between border border-slate-400 bg-white">

                        {/* HEADER */}
                        <header className="flex-shrink-0 flex justify-between border-b border-slate-300 p-2 space-x-2">
                            <div className="flex flex-col gap-0.5 w-2/3 overflow-hidden">
                                <h1 className="text-base font-bold text-slate-800 uppercase leading-tight break-words">
                                    {receipt.companySnapshot.razonSocial}
                                </h1>
                                <p className="text-[9px] font-normal text-slate-500 whitespace-nowrap">
                                    CUIT: <span className="font-semibold text-slate-700">{receipt.companySnapshot.cuit}</span>
                                </p>
                                <p className="text-[9px] font-normal text-slate-500 w-full leading-tight break-words has-[:truncate]:truncate">
                                    {receipt.companySnapshot.domicilio}
                                </p>
                            </div>
                            <div className="w-1/3 border border-slate-300 rounded bg-gray-50 p-1.5 flex flex-col items-center justify-center gap-0.5 shadow-sm min-w-0">
                                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 whitespace-nowrap">Recibo de Haberes</h2>
                                <div className="flex gap-2 mt-0.5 justify-center w-full">
                                    <div className="text-center min-w-0 flex-1">
                                        <span className="block text-[7px] uppercase text-slate-500 font-bold tracking-tight">Período</span>
                                        <span className="block text-[10px] font-bold text-slate-900 leading-none whitespace-nowrap">
                                            {String(receipt.periodo.mes).padStart(2, '0')}/{receipt.periodo.anio}
                                        </span>
                                    </div>
                                    <div className="w-px bg-slate-400 h-6 shrink-0"></div>
                                    <div className="text-center min-w-0 flex-1">
                                        <span className="block text-[7px] uppercase text-slate-500 font-bold tracking-tight">N° Recibo</span>
                                        <span className="block text-[10px] font-bold text-slate-900 leading-none whitespace-nowrap">#00000{/* Placeholder */}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* SUB-HEADER: Employee Grid */}
                        <section className="flex-shrink-0 border-b border-slate-300">
                            <div className="grid grid-cols-2 divide-x divide-slate-300 text-[9px]">
                                {/* Block 1 */}
                                <div className="flex flex-col overflow-hidden">
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Legajo</div>
                                    <div className="px-2 py-1 font-bold text-slate-800 border-b border-slate-200 min-h-[1.25rem]">{receipt.employeeSnapshot.legajo || '-'}</div>
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Tarea / Cargo</div>
                                    <div className="px-2 py-1 font-semibold text-slate-800 leading-tight break-words" title={receipt.employeeSnapshot.cargo}>{receipt.employeeSnapshot.cargo}</div>
                                </div>
                                {/* Block 2 */}
                                <div className="flex flex-col overflow-hidden">
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Apellido y Nombre</div>
                                    <div className="px-2 py-1 font-bold text-slate-800 border-b border-slate-200 leading-tight break-words" title={`${receipt.employeeSnapshot.apellido}, ${receipt.employeeSnapshot.nombre}`}>
                                        {receipt.employeeSnapshot.apellido}, {receipt.employeeSnapshot.nombre}
                                    </div>
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">CBU</div>
                                    <div className="px-2 py-1 font-mono text-slate-800 truncate text-[8px]">{receipt.employeeSnapshot.cbu}</div>
                                </div>
                                {/* Block 3 */}
                                <div className="flex flex-col border-t border-slate-300 overflow-hidden">
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">C.U.I.L.</div>
                                    <div className="px-2 py-1 font-bold text-slate-800 whitespace-nowrap border-b border-slate-200">{receipt.employeeSnapshot.cuil}</div>
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Banco</div>
                                    <div className="px-2 py-1 font-semibold text-slate-800 leading-tight break-words" title={receipt.employeeSnapshot.banco}>{receipt.employeeSnapshot.banco || '-'}</div>
                                </div>
                                {/* Block 4 */}
                                <div className="flex flex-col border-t border-slate-300 overflow-hidden">
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Fecha Ingreso</div>
                                    <div className="px-2 py-1 font-bold text-slate-800 whitespace-nowrap border-b border-slate-200">
                                        {new Date(receipt.employeeSnapshot.fechaIngreso).toLocaleDateString()}
                                    </div>
                                    <div className="bg-gray-50 px-2 py-1 font-bold uppercase text-slate-600 border-b border-slate-200 truncate">Último Depósito</div>
                                    <div className="px-2 py-1 text-slate-800 whitespace-nowrap truncate">-</div>
                                </div>
                            </div>
                        </section>

                        {/* BODY: Concepts Table */}
                        <div className="flex-grow overflow-hidden relative">
                            <table className="w-full border-collapse table-fixed">
                                <thead className="bg-gray-50 border-b border-slate-300">
                                    <tr className="text-[9px] uppercase text-slate-600 tracking-tight">
                                        <th className="px-2 py-1 text-left w-[8%] font-bold border-r border-slate-300 truncate">Código</th>
                                        <th className="px-2 py-1 text-left w-[32%] font-bold border-r border-slate-300 truncate">Concepto</th>
                                        <th className="px-2 py-1 text-center w-[6%] font-bold border-r border-slate-300 truncate">Unid.</th>
                                        <th className="px-2 py-1 text-right w-[18%] font-bold border-r border-slate-300 truncate">Haberes</th>
                                        <th className="px-2 py-1 text-right w-[18%] font-bold border-r border-slate-300 truncate">No Rem.</th>
                                        <th className="px-2 py-1 text-right w-[18%] font-bold truncate">Deduc.</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[8px] text-slate-700 divide-y divide-slate-100 align-top">
                                    {receipt.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-2 py-1 border-r border-slate-200 text-slate-500 font-mono text-left">{item.codigo}</td>
                                            <td className="px-2 py-1 border-r border-slate-200 font-medium break-words whitespace-normal leading-tight text-left">{item.concepto}</td>
                                            <td className="px-2 py-1 border-r border-slate-200 text-center">{item.unidades > 0 ? item.unidades : ''}</td>
                                            <td className="px-2 py-1 border-r border-slate-200 text-right font-mono text-[7px] tracking-tighter text-slate-700 whitespace-nowrap">
                                                {item.montoRemunerativo > 0 && formatCurrency(item.montoRemunerativo).replace('ARS', '').trim()}
                                            </td>
                                            <td className="px-2 py-1 border-r border-slate-200 text-right font-mono text-[7px] tracking-tighter text-slate-700 whitespace-nowrap">
                                                {item.montoNoRemunerativo > 0 && formatCurrency(item.montoNoRemunerativo).replace('ARS', '').trim()}
                                            </td>
                                            <td className="px-2 py-1 text-right font-mono text-[7px] tracking-tighter text-red-600 whitespace-nowrap">
                                                {item.montoDeduccion > 0 && formatCurrency(item.montoDeduccion).replace('ARS', '').trim()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* FOOTER: Totals & Signatures */}
                        <footer className="flex-shrink-0 mt-auto border-t-2 border-slate-800 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                            <div className="grid grid-cols-12 divide-x divide-slate-300 border-b border-slate-300">
                                <div className="col-span-6 px-2 py-1 flex items-center bg-zinc-50 overflow-hidden">
                                    <span className="text-[8px] font-bold uppercase text-slate-500 mr-1 whitespace-nowrap shrink-0">Son Pesos:</span>
                                    <span className="text-[9px] font-bold italic text-slate-800 leading-tight truncate" title={numberToWords(receipt.totales.totalNeto)}>
                                        {numberToWords(receipt.totales.totalNeto)}
                                    </span>
                                </div>
                                <div className="col-span-2 px-1 py-1 flex flex-col items-end justify-center bg-gray-50 overflow-hidden">
                                    <span className="text-[8px] font-bold uppercase text-slate-500 whitespace-nowrap">Bruto</span>
                                    <span className="text-[9px] font-bold text-slate-800 whitespace-nowrap tracking-tight">{formatCurrency(receipt.totales.totalBruto)}</span>
                                </div>
                                <div className="col-span-2 px-1 py-1 flex flex-col items-end justify-center bg-gray-50 overflow-hidden">
                                    <span className="text-[8px] font-bold uppercase text-slate-500 whitespace-nowrap">Desc.</span>
                                    <span className="text-[9px] font-bold text-red-600 whitespace-nowrap tracking-tight">{formatCurrency(receipt.totales.totalDescuentos)}</span>
                                </div>
                                <div className="col-span-2 px-1 py-1 flex flex-col items-center justify-center bg-slate-800 text-white overflow-hidden">
                                    <span className="text-[8px] font-bold uppercase opacity-80 whitespace-nowrap">Neto</span>
                                    <span className="text-[11px] font-bold text-white w-full text-center leading-tight whitespace-nowrap tracking-tight">{formatCurrency(receipt.totales.totalNeto)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 p-4 pt-8">
                                <div className="border-t border-dashed border-slate-400 pt-1 text-center relative">
                                    <p className="text-[8px] font-bold uppercase text-slate-400">Firma del Empleador</p>
                                </div>
                                <div className="border-t border-dashed border-slate-400 pt-1 text-center relative">
                                    <p className="text-[8px] font-bold uppercase text-slate-400">Firma del Empleado</p>
                                </div>
                            </div>

                            <div className="pb-1 text-center">
                                <p className="text-[8px] text-slate-400 uppercase font-bold">{label}</p>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-20 text-center">Cargando vista previa...</div>;
    if (!receipt) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-20 print:bg-white print:pb-0 print:h-auto print:overflow-visible">
            {/* Toolbar - Sticky Top */}
            <div className="sticky top-0 w-full bg-white border-b border-gray-200 shadow-sm z-10 px-4 py-3 flex justify-between items-center print:hidden">
                <Link to="/dashboard/receipts" className="flex items-center text-gray-600 hover:text-gray-900 transition gap-2">
                    <ArrowLeft size={20} /> <span className="font-medium">Volver</span>
                </Link>

                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F2C4C] text-white rounded-lg hover:bg-[#1a4b80] transition font-medium shadow-md"
                    >
                        <Printer size={18} /> Imprimir
                    </button>
                    {/* Reuse PDF download logic if needed, or just rely on Print to PDF */}
                </div>
            </div>

            {/* Main Content - Single Receipt Responsive */}
            <div className="mt-8 bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-8 mx-auto print:shadow-none print:mt-0 print:w-full print:max-w-none print:min-h-0 print:h-auto print:p-0">
                <ReceiptTemplate type="ORIGINAL" />
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: A4; /* User requested one receipt, A4 Portrait is standard for single, or A4 Landscape half-page? */
                        /* Actually, the user said "solo muestra un recibo". A full page receipt is usually A4 Portrait. */
                        margin: 0.5cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background-color: white;
                    }
                    /* Hide everything else */
                    body > * {
                        display: none;
                    }
                    #root {
                        display: block;
                    }
                    nav, aside, .sidebar { 
                        display: none !important; 
                    }
                }
            `}</style>
        </div>
    );
};

export default ReceiptPreviewPage;
