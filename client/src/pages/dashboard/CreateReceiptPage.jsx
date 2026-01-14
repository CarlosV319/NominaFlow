import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { createReceipt, resetReceiptStatus } from '../../store/slices/receiptSlice';
import { Building, Plus, Trash2, Calculator, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CreateReceiptPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { activeCompany } = useAppSelector((state) => state.company);
    const { employees } = useAppSelector((state) => state.employee);
    const { loading, success, error } = useAppSelector((state) => state.receipt);

    // Initial Setup
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            employeeId: '',
            periodo: {
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
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

    // Real-time Totals Watcher
    const items = useWatch({ control, name: 'items' });
    const selectedEmployeeId = useWatch({ control, name: 'employeeId' });

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
        if (error) toast.error(typeof error === 'string' ? error : 'Error al generar recibo');
    }, [error]);

    useEffect(() => {
        if (selectedEmployee && selectedEmployee.sueldoBruto) {
            // Auto-update concept 1000 amount if present and 0
            const currentItems = items;
            if (currentItems[0] && currentItems[0].codigo === '1000' && currentItems[0].monto == 0) {
                setValue(`items.0.monto`, selectedEmployee.sueldoBruto);
            }
        }
    }, [selectedEmployee, setValue]);


    // Handlers
    const handleLoadConcepts = () => {
        if (!selectedEmployee) return toast.error('Selecciona un empleado primero');

        const bruto = selectedEmployee.sueldoBruto || 0;
        const jubilacion = bruto * 0.11;
        const ley19032 = bruto * 0.03;
        const obraSocial = bruto * 0.03;

        setValue('items', [
            { codigo: '1000', concepto: 'Sueldo Básico', unidades: 30, tipo: 'remunerativo', monto: bruto },
            { codigo: '8100', concepto: 'Jubilación', unidades: 11, tipo: 'deduccion', monto: jubilacion },
            { codigo: '8200', concepto: 'Ley 19.032', unidades: 3, tipo: 'deduccion', monto: ley19032 },
            { codigo: '8300', concepto: 'Obra Social', unidades: 3, tipo: 'deduccion', monto: obraSocial },
        ]);
        toast.success('Conceptos base cargados');
    };

    const onSubmit = async (data) => {
        // Transform data for Backend
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
            items: formattedItems
        };

        try {
            const res = await dispatch(createReceipt(payload)).unwrap();
            toast.success('Recibo generado correctamente');
            navigate(`/dashboard/receipts/${res._id}/preview`);
        } catch (err) {
            // Error is handled by slice/toast in useEffect or here
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
                    <h1 className="font-bold text-[#0F2C4C]">Nuevo Recibo</h1>
                    <p className="text-gray-500">Generación de liquidación para {activeCompany.razonSocial}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Form (8 cols) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1. Selection Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Building size={18} className="text-brand-secondary" />
                            Datos del Recibo
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
                                    <input type="number" {...register('periodo.mes')} className="w-full p-2.5 border border-gray-300 rounded-lg text-center" min="1" max="12" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                    <input type="number" {...register('periodo.anio')} className="w-full p-2.5 border border-gray-300 rounded-lg text-center" min="2020" />
                                </div>
                            </div>
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
                                className="text-xs px-3 py-1.5 bg-white border border-brand-secondary text-brand-secondary rounded-md hover:bg-orange-50 font-medium transition"
                            >
                                ⚡ Cargar Conceptos Base
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
                            <Plus size={16} /> Agregar Concepto
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
