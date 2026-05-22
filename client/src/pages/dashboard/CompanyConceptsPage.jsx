import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateCompany } from '../../store/slices/companySlice';
import { ArrowLeft, Plus, Save, Trash2, Download, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../../hooks/useSubscription';
import UpgradeModal from '../../components/modals/UpgradeModal';
import api from '../../api/axios';

const CompanyConceptsPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activeCompany, loading } = useAppSelector((state) => state.company);
    const { plan } = useSubscription();

    const [conceptos, setConceptos] = useState([]);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (!activeCompany) {
            toast.error('Selecciona una empresa primero');
            navigate('/dashboard/companies');
            return;
        }
        if (activeCompany.conceptosPersonalizados) {
            setConceptos(activeCompany.conceptosPersonalizados);
        }
    }, [activeCompany, navigate]);

    const handleAddConcept = () => {
        setConceptos([
            ...conceptos,
            {
                codigo: '',
                concepto: '',
                tipoCalculo: 'unidades',
                tipoConcepto: 'remunerativo',
                _id: Math.random().toString(36).substr(2, 9) // temporary ID for rendering
            }
        ]);
    };

    const handleRemoveConcept = (index) => {
        const newConceptos = [...conceptos];
        newConceptos.splice(index, 1);
        setConceptos(newConceptos);
    };

    const handleChange = (index, field, value) => {
        const newConceptos = [...conceptos];
        newConceptos[index][field] = value;
        setConceptos(newConceptos);
    };

    const handleSave = async () => {
        // Validation
        for (let i = 0; i < conceptos.length; i++) {
            const c = conceptos[i];
            if (!c.codigo || !c.concepto) {
                toast.error(`El concepto en la fila ${i + 1} no tiene código o nombre válido.`);
                return;
            }
        }

        try {
            // Remove temporary _id before saving to avoid mongoose errors if it tries to parse it as ObjectId, 
            // though Mongoose usually auto-generates them if we just send the array of objects without _id.
            const cleanConceptos = conceptos.map(({ _id, ...rest }) => rest);

            await dispatch(updateCompany({
                id: activeCompany._id,
                data: { conceptosPersonalizados: cleanConceptos }
            })).unwrap();

            toast.success('Conceptos guardados exitosamente');
        } catch (error) {
            toast.error('Error al guardar conceptos');
            console.error(error);
        }
    };

    const handleExportLSD = async () => {
        if (!plan || plan === 'INICIAL') {
            setShowUpgradeModal(true);
            return;
        }

        try {
            setIsExporting(true);
            const response = await api.get(`/lsd/concepts/export/${activeCompany._id}`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Conceptos_LSD_${activeCompany.cuit}.txt`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            toast.success('Archivo descargado correctamente');
        } catch (error) {
            console.error('Error exporting LSD:', error);
            if (error.response?.status === 403) {
                setShowUpgradeModal(true);
            } else {
                toast.error('Ocurrió un error al generar el archivo TXT');
            }
        } finally {
            setIsExporting(false);
        }
    };

    if (!activeCompany) return null;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/companies" className="p-1.5 bg-white rounded-lg border text-gray-500 hover:text-gray-800 transition">
                    <ArrowLeft size={14} />
                </Link>
                <div>
                    <h1 className="font-bold text-[#0F2C4C] text-[12px]">Conceptos Personalizados</h1>
                    <p className="text-[10px] text-gray-500">Administra los conceptos frecuentes para {activeCompany.razonSocial}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-[12px] text-slate-800">Lista de Conceptos</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportLSD}
                            disabled={isExporting || conceptos.length === 0}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-medium text-[10px] border
                                ${(!plan || plan === 'INICIAL') 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}
                                disabled:opacity-50`}
                        >
                            {(!plan || plan === 'INICIAL') ? <Crown size={12} className="text-amber-500" /> : <Download size={12} />}
                            {isExporting ? 'Generando...' : 'Exportar a AFIP (LSD)'}
                        </button>
                        <button
                            onClick={handleAddConcept}
                            className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition font-medium text-[10px] border border-indigo-200"
                        >
                            <Plus size={12} /> Añadir Concepto
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {conceptos.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-500">No hay conceptos personalizados registrados.</p>
                            <p className="text-sm text-slate-400 mt-1">Añade uno para que aparezca en el autocompletado del recibo.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                                        <th className="p-2 font-bold w-24">Código</th>
                                        <th className="p-2 font-bold">Nombre del Concepto</th>
                                        <th className="p-2 font-bold w-40">Tipo de Cálculo</th>
                                        <th className="p-2 font-bold w-40">Naturaleza</th>
                                        <th className="p-2 font-bold w-10 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conceptos.map((concepto, index) => (
                                        <tr key={concepto._id || index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="p-1">
                                                <input
                                                    type="text"
                                                    value={concepto.codigo}
                                                    onChange={(e) => handleChange(index, 'codigo', e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-[10px] focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
                                                    placeholder="Ej: 1001"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <input
                                                    type="text"
                                                    value={concepto.concepto}
                                                    onChange={(e) => handleChange(index, 'concepto', e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-[10px] focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
                                                    placeholder="Ej: Bono Productividad"
                                                />
                                            </td>
                                            <td className="p-1">
                                                <select
                                                    value={concepto.tipoCalculo}
                                                    onChange={(e) => handleChange(index, 'tipoCalculo', e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-[10px] focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
                                                >
                                                    <option value="unidades">Unidades / Fijo</option>
                                                    <option value="porcentaje">Porcentaje (%)</option>
                                                </select>
                                            </td>
                                            <td className="p-1">
                                                <select
                                                    value={concepto.tipoConcepto}
                                                    onChange={(e) => handleChange(index, 'tipoConcepto', e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-[10px] focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
                                                >
                                                    <option value="remunerativo">Haberes</option>
                                                    <option value="no_remunerativo">No Remun.</option>
                                                    <option value="deduccion">Deducción</option>
                                                </select>
                                            </td>
                                            <td className="p-1 text-center">
                                                <button
                                                    onClick={() => handleRemoveConcept(index)}
                                                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                                    title="Eliminar concepto"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-[#0F2C4C] text-[10px] text-white px-4 py-2 rounded-lg hover:bg-[#1a4b80] transition font-bold shadow-md disabled:opacity-70"
                    >
                        <Save size={14} />
                        {loading ? 'Guardando...' : 'Guardar Conceptos'}
                    </button>
                </div>
            </div>

            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
            />
        </div>
    );
};

export default CompanyConceptsPage;
