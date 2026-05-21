import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { 
    createReceipt, 
    calculateReceipt, 
    calculateSACReceipt, 
    calculateVacacionesReceipt, 
    calculateFinalReceipt 
} from '../../store/slices/receiptSlice';
import { Building, Plus, Trash2, Calculator, Save, ArrowLeft, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CreateReceiptPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activeCompany } = useAppSelector((state) => state.company);
    const { employees } = useAppSelector((state) => state.employee);
    const { loading, error } = useAppSelector((state) => state.receipt);

    // States for Employer Costs & Ganancias tracking
    const [contribucionesPatronales, setContribucionesPatronales] = useState(null);
    const [gananciasDetalle, setGananciasDetalle] = useState(null);

    // Initial Setup
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            employeeId: '',
            tipoLiquidacion: 'mensual',
            periodo: {
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
            },
            options: {
                diasTrabajados: 30,
                horasExtra50: 0,
                horasExtra100: 0,
                incluirPresentismo: true,
                incluirAntiguedad: true,
                calcularGanancias: true,
                // SAC Specific
                mejorRemuneracion: 0,
                diasTrabajadosSAC: 180,
                // Vacaciones Specific
                diasVacaciones: 14,
            },
            items: [
                { codigo: '1000', concepto: 'Sueldo Básico', unidades: 30, tipo: 'remunerativo', monto: 0 }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    });

    // Watchers
    const items = useWatch({ control, name: 'items' });
    const selectedEmployeeId = useWatch({ control, name: 'employeeId' });
    const tipoLiquidacion = useWatch({ control, name: 'tipoLiquidacion' });
    const options = useWatch({ control, name: 'options' });

    // Derived State for UI
    const selectedEmployee = employees.find(e => e._id === selectedEmployeeId);

    const totals = items.reduce((acc, item) => {
        const monto = Number(item.monto) || 0;
        if (item.tipo === 'remunerativo') acc.remunerativo += monto;
        if (item.tipo === 'no_remunerativo') acc.no_remunerativo += monto;
        if (item.tipo === 'deduccion') acc.descuentos += monto;
        return acc;
    }, { remunerativo: 0, no_remunerativo: 0, descuentos: 0 });

    const totalBruto = totals.remunerativo + totals.no_remunerativo;
    const totalNeto = totalBruto - totals.descuentos;

    // Effects
    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchEmployees(activeCompany._id));
        }
    }, [activeCompany, dispatch]);

    useEffect(() => {
        if (error) toast.error(typeof error === 'string' ? error : 'Error en el recibo');
    }, [error]);

    useEffect(() => {
        if (selectedEmployee && selectedEmployee.sueldoBruto && tipoLiquidacion === 'mensual') {
            const currentItems = items;
            if (currentItems[0] && currentItems[0].codigo === '1000' && currentItems[0].monto == 0) {
                setValue(`items.0.monto`, selectedEmployee.sueldoBruto);
            }
        }
    }, [selectedEmployee, tipoLiquidacion, setValue]);


    // Handlers
    const handleLoadConcepts = async () => {
        if (!selectedEmployee) return toast.error('Selecciona un empleado primero');

        const formData = watch();
        const payload = {
            employeeId: selectedEmployee._id,
            periodo: {
                mes: Number(formData.periodo.mes),
                anio: Number(formData.periodo.anio)
            },
            options: formData.options
        };

        try {
            let res;
            if (tipoLiquidacion === 'mensual') {
                res = await dispatch(calculateReceipt(payload)).unwrap();
            } else if (tipoLiquidacion === 'sac') {
                payload.mejorRemuneracion = Number(formData.options.mejorRemuneracion);
                payload.diasTrabajados = Number(formData.options.diasTrabajadosSAC);
                res = await dispatch(calculateSACReceipt(payload)).unwrap();
            } else if (tipoLiquidacion === 'vacaciones') {
                payload.options.diasProporcionales = Number(formData.options.diasVacaciones);
                res = await dispatch(calculateVacacionesReceipt(payload)).unwrap();
            } else if (tipoLiquidacion === 'final') {
                payload.options.diasTrabajadosMes = Number(formData.options.diasTrabajados);
                const finalRes = await dispatch(calculateFinalReceipt(payload)).unwrap();
                
                // Map breakdown to items array
                const mappedItems = Object.entries(finalRes.desglose).map(([key, item], index) => ({
                    codigo: `9${index}00`,
                    concepto: item.concepto,
                    unidades: 0,
                    tipo: key === 'sueldoProporcional' ? 'remunerativo' : 'no_remunerativo', // Depende del rubro pero simplificamos
                    monto: item.monto
                }));
                
                setValue('items', mappedItems);
                toast.success('Liquidación Final calculada');
                return;
            }

            if (res) {
                setValue('items', res.items);
                setContribucionesPatronales(res.contribucionesPatronales);
                if (res.gananciasDetalle) {
                    setGananciasDetalle(res.gananciasDetalle);
                }
                toast.success('Conceptos base calculados automáticamente');
            }

        } catch (err) {
            console.error(err);
            toast.error('No se pudieron calcular los conceptos');
        }
    };

    const onSubmit = async (data) => {
        const formattedItems = data.items.map(item => ({
            codigo: item.codigo,
            concepto: item.concepto,
            unidades: Number(item.unidades),
            montoRemunerativo: item.tipo === 'remunerativo' ? Number(item.monto) : 0,
            montoNoRemunerativo: item.tipo === 'no_remunerativo' ? Number(item.monto) : 0,
            montoDeduccion: item.tipo === 'deduccion' ? Number(item.monto) : 0,
        }));

        const payload = {
            employeeId: data.employeeId,
            periodo: {
                mes: Number(data.periodo.mes),
                anio: Number(data.periodo.anio)
            },
            tipoLiquidacion: data.tipoLiquidacion,
            items: formattedItems,
            contribucionesPatronales,
            gananciasDetalle
        };

        try {
            const res = await dispatch(createReceipt(payload)).unwrap();
            toast.success('Recibo generado correctamente');
            navigate(`/dashboard/receipts/${res._id}/preview`);
        } catch (err) {
            console.error(err);
        }
    };

    if (!activeCompany) {
        return <div className="p-10 text-center">Selecciona una empresa primero.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard/receipts" className="p-2 bg-white rounded-lg border text-gray-500 hover:text-gray-800 transition">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="font-bold text-[#0F2C4C]">Nuevo Recibo Automático</h1>
                    <p className="text-gray-500">Motor de cálculo Ley Argentina 2026 para {activeCompany.razonSocial}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Form (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1. Selection Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Building size={18} className="text-brand-secondary" />
                            Parámetros del Recibo
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                                <select
                                    {...register('employeeId', { required: 'Requerido' })}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary outline-none bg-gray-50"
                                >
                                    <option value="">-- Seleccionar Empleado --</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>{emp.apellido}, {emp.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Liquidación</label>
                                <select
                                    {...register('tipoLiquidacion')}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary outline-none bg-blue-50 text-[#0F2C4C] font-semibold"
                                >
                                    <option value="mensual">Mensual Ordinaria</option>
                                    <option value="sac">SAC (Aguinaldo)</option>
                                    <option value="vacaciones">Vacaciones</option>
                                    <option value="final">Liquidación Final por Despido</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                                <input type="number" {...register('periodo.mes')} className="w-full p-2 border border-gray-300 rounded-lg text-center" min="1" max="12" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                <input type="number" {...register('periodo.anio')} className="w-full p-2 border border-gray-300 rounded-lg text-center" min="2020" />
                            </div>

                            {tipoLiquidacion === 'mensual' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hs. Ext. 50%</label>
                                        <input type="number" {...register('options.horasExtra50')} className="w-full p-2 border border-gray-300 rounded-lg text-center" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hs. Ext. 100%</label>
                                        <input type="number" {...register('options.horasExtra100')} className="w-full p-2 border border-gray-300 rounded-lg text-center" min="0" />
                                    </div>
                                </>
                            )}
                            
                            {tipoLiquidacion === 'sac' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mejor Remun.</label>
                                        <input type="number" {...register('options.mejorRemuneracion')} className="w-full p-2 border border-gray-300 rounded-lg text-center" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Días Trabaj.</label>
                                        <input type="number" {...register('options.diasTrabajadosSAC')} className="w-full p-2 border border-gray-300 rounded-lg text-center" />
                                    </div>
                                </>
                            )}

                            {tipoLiquidacion === 'vacaciones' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Días a gozar</label>
                                    <input type="number" {...register('options.diasVacaciones')} className="w-full p-2 border border-gray-300 rounded-lg text-center" />
                                </div>
                            )}

                        </div>

                        {/* Employee Preview */}
                        {selectedEmployee && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between text-sm">
                                <div>
                                    <p><span className="font-bold text-[#0F2C4C]">CUIL:</span> {selectedEmployee.cuil}</p>
                                    <p><span className="font-bold text-[#0F2C4C]">Ingreso:</span> {new Date(selectedEmployee.fechaIngreso).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p><span className="font-bold text-[#0F2C4C]">Cargo:</span> {selectedEmployee.cargo}</p>
                                    <p><span className="font-bold text-[#0F2C4C]">Sueldo Pactado:</span> ${selectedEmployee.sueldoBruto?.toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Concepts Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Conceptos</h3>
                            <button
                                type="button"
                                onClick={handleLoadConcepts}
                                className="text-sm px-4 py-2 bg-[#E85D04] text-white rounded-lg hover:bg-[#d15403] font-bold shadow-md transition flex items-center gap-1"
                            >
                                <Zap size={16} /> Autocompletar Cálculo
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-3 w-20">Códig</th>
                                        <th className="px-4 py-3">Concepto</th>
                                        <th className="px-4 py-3 w-24">Unidades</th>
                                        <th className="px-4 py-3 w-32">Tipo</th>
                                        <th className="px-4 py-3 w-32">Monto</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="hover:bg-gray-50/50 group">
                                            <td className="p-2">
                                                <input {...register(`items.${index}.codigo`)} className="w-full p-2 border border-transparent hover:border-gray-300 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-secondary transition" placeholder="Cod" />
                                            </td>
                                            <td className="p-2">
                                                <input {...register(`items.${index}.concepto`)} className="w-full p-2 border border-transparent hover:border-gray-300 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-secondary transition" placeholder="Descripción del concepto" />
                                            </td>
                                            <td className="p-2">
                                                <input {...register(`items.${index}.unidades`)} className="w-full p-2 text-center border border-transparent hover:border-gray-300 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-secondary transition" placeholder="0" />
                                            </td>
                                            <td className="p-2">
                                                <select {...register(`items.${index}.tipo`)} className="w-full p-2 border border-transparent hover:border-gray-300 rounded bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-secondary text-xs">
                                                    <option value="remunerativo">Haberes</option>
                                                    <option value="deduccion">Deducción</option>
                                                    <option value="no_remunerativo">No Remun.</option>
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        {...register(`items.${index}.monto`, { required: true })}
                                                        className={`w-full pl-6 pr-2 py-1.5 font-mono text-right border rounded focus:outline-none focus:ring-1 focus:ring-brand-secondary 
                                                            ${items[index]?.tipo === 'deduccion' ? 'text-red-600 bg-red-50/30 border-red-100' : 'text-green-700 bg-green-50/30 border-green-100'}
                                                        `}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            type="button"
                            onClick={() => append({ codigo: '', concepto: '', unidades: 0, tipo: 'remunerativo', monto: 0 })}
                            className="w-full py-3 text-center text-sm font-semibold text-[#0F2C4C] bg-gray-50 hover:bg-blue-50 transition border-t border-gray-100 flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Agregar Concepto Manual
                        </button>
                    </div>

                </div>

                {/* Right Column: Totals (4 cols) - Sticky */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100 p-6 sticky top-6">
                        <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2 border-b pb-4">
                            <Calculator size={20} className="text-[#E85D04]" /> Resumen
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total Haberes Remun.</span>
                                <span className="font-mono text-gray-900">${totals.remunerativo.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Total No Remunerativo</span>
                                <span className="font-mono text-gray-900">${totals.no_remunerativo.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500 font-medium">
                                <span>Total Descuentos</span>
                                <span className="font-mono">- ${totals.descuentos.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-lg text-[#0F2C4C]">NETO A COBRAR</span>
                                    <span className="font-bold text-2xl text-[#E85D04] font-mono">
                                        ${totalNeto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Costo Laboral Empleador (Transparencia) */}
                        {contribucionesPatronales && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Costo Laboral Empleador</h4>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Contrib. Jubilación:</span>
                                        <span>${contribucionesPatronales.jubilacion.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Obra Social:</span>
                                        <span>${contribucionesPatronales.obraSocial.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ART / Seguros:</span>
                                        <span>${(contribucionesPatronales.artFijo + contribucionesPatronales.scvo).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-800 pt-1 mt-1 border-t border-gray-200">
                                        <span>Costo Extra Total:</span>
                                        <span>${contribucionesPatronales.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 text-white font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-3
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0F2C4C] hover:bg-[#1C3E61] hover:-translate-y-1 hover:shadow-2xl'}
                            `}
                        >
                            {loading ? (
                                'Generando...'
                            ) : (
                                <>
                                    <Save size={20} /> Generar Recibo
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default CreateReceiptPage;
