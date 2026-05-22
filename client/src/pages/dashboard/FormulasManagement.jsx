import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFormulas, createFormula, updateFormula, deleteFormula } from '../../store/slices/formulaSlice';
import { Edit2, Trash2, Plus, Save, X, Calculator } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FormulasManagement = () => {
    const dispatch = useDispatch();
    const { formulas, loading, error } = useSelector(state => state.formulas);
    const { user } = useSelector(state => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [currentFormula, setCurrentFormula] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Percepción',
        expression: '',
        description: '',
        requiredVariables: '',
        isActive: true,
        isGlobal: true,
    });

    useEffect(() => {
        dispatch(fetchFormulas(user.role === 'SUPERADMIN' ? null : user.companyId));
    }, [dispatch, user]);

    const handleEdit = (formula) => {
        setCurrentFormula(formula);
        setFormData({
            ...formula,
            requiredVariables: formula.requiredVariables.join(', '),
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar esta fórmula?')) {
            try {
                await dispatch(deleteFormula(id)).unwrap();
                toast.success('Fórmula eliminada');
            } catch (err) {
                toast.error(err || 'Error al eliminar');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            requiredVariables: formData.requiredVariables.split(',').map(v => v.trim()).filter(Boolean),
            tenantId: user.role !== 'SUPERADMIN' ? user.companyId : null,
            isGlobal: user.role === 'SUPERADMIN',
        };

        try {
            if (currentFormula) {
                await dispatch(updateFormula({ id: currentFormula._id, data: payload })).unwrap();
                toast.success('Fórmula actualizada');
            } else {
                await dispatch(createFormula(payload)).unwrap();
                toast.success('Fórmula creada');
            }
            setIsEditing(false);
            setCurrentFormula(null);
        } catch (err) {
            toast.error(err || 'Error al guardar');
        }
    };

    if (loading && formulas.length === 0) return <div className="p-4 text-center">Cargando fórmulas...</div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-secondary/10 rounded-lg">
                        <Calculator size={24} className="text-brand-secondary" />
                    </div>
                    <div>
                        <h1 className="text-[14px] font-bold text-slate-800">Fórmulas y Conceptos</h1>
                        <p className="text-[10px] text-slate-500">Gestiona las fórmulas para calcular automáticamente la nómina.</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setCurrentFormula(null);
                        setFormData({
                            name: '',
                            type: 'Percepción',
                            expression: '',
                            description: '',
                            requiredVariables: '',
                            isActive: true,
                            isGlobal: user.role === 'SUPERADMIN'
                        });
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-brand-primary/90 transition"
                >
                    <Plus size={16} /> Nueva Fórmula
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                            <th className="p-3 font-bold">Nombre</th>
                            <th className="p-3 font-bold">Tipo</th>
                            <th className="p-3 font-bold">Expresión</th>
                            <th className="p-3 font-bold text-center">Estado</th>
                            <th className="p-3 font-bold text-center">Alcance</th>
                            <th className="p-3 font-bold text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {formulas.map(formula => (
                            <tr key={formula._id} className="hover:bg-slate-50 transition text-[12px]">
                                <td className="p-3 font-bold text-slate-800">{formula.name}</td>
                                <td className="p-3 text-slate-600">{formula.type}</td>
                                <td className="p-3 font-mono text-[10px] text-slate-600 bg-slate-50 rounded px-2">{formula.expression}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${formula.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {formula.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    {formula.isGlobal ? (
                                        <span className="text-blue-600 font-bold">Global</span>
                                    ) : (
                                        <span className="text-orange-600 font-bold">Personalizado</span>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {(user.role === 'SUPERADMIN' || !formula.isGlobal) && (
                                            <>
                                                <button onClick={() => handleEdit(formula)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(formula._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {formulas.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">No hay fórmulas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-[14px]">
                                {currentFormula ? 'Editar Fórmula' : 'Nueva Fórmula'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-brand-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-brand-primary outline-none"
                                >
                                    <option value="Percepción">Percepción (Suma)</option>
                                    <option value="Deducción">Deducción (Resta)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Fórmula (Expresión)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: (salario_base / 30) * horas_extras * 1.5"
                                    value={formData.expression}
                                    onChange={e => setFormData({ ...formData, expression: e.target.value })}
                                    className="w-full px-3 py-2 border rounded font-mono text-[12px] focus:ring-2 focus:ring-brand-primary outline-none"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Usa variables matemáticas básicas y nombres de variables en minúscula.</p>
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-slate-700 mb-1">Variables Requeridas (separadas por coma)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: salario_base, horas_extras"
                                    value={formData.requiredVariables}
                                    onChange={e => setFormData({ ...formData, requiredVariables: e.target.value })}
                                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-brand-primary outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-[12px] font-bold text-slate-700">Fórmula Activa</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-[12px] bg-slate-100 rounded">Cancelar</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-[12px] bg-brand-primary text-white rounded flex items-center gap-2">
                                    <Save size={16} /> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormulasManagement;
