import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import InputGroup from '../ui/InputGroup';

const employeeSchema = z.object({
    // Personal Logic
    nombre: z.string().min(1, 'Nombre requerido'),
    apellido: z.string().min(1, 'Apellido requerido'),
    cuil: z.string().regex(/^\d{11}$/, 'CUIL debe tener 11 números'),
    fechaNacimiento: z.string().min(1, 'Fecha requerida'),

    // Work Logic
    legajo: z.string().min(1, 'Legajo requerido'),
    fechaIngreso: z.string().min(1, 'Fecha de ingreso requerida'),
    cargo: z.string().min(1, 'Cargo requerido'),
    modalidadContratacion: z.string().min(1, 'Modalidad requerida'),
    sueldoBruto: z.coerce.number().min(0, 'Sueldo inválido'),

    // Bank Logic
    banco: z.string().optional(),
    cbu: z.string().regex(/^\d{22}$/, 'CBU debe tener 22 números'),
});

const EmployeeFormModal = ({ isOpen, onClose, onCreate, loading, activeCompanyId }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            modalidadContratacion: 'Tiempo Indeterminado',
            banco: '',
            cbu: ''
        }
    });

    const onSubmit = (data) => {
        // Inject company ID
        onCreate({ ...data, company: activeCompanyId });
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header fixed */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-[#0F2C4C]">Alta de Nuevo Empleado</h2>
                        <p className="text-xs text-gray-500 hidden sm:block">Completa los datos para dar de alta en la nómina.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="overflow-y-auto p-5 custom-scrollbar">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Section 1: Personal & Bank (Side by Side on Lg) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {/* Personal */}
                            <div className="border border-gray-200 rounded-xl p-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Datos Personales
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InputGroup label="Nombre" name="nombre" register={register} error={errors.nombre} />
                                    <InputGroup label="Apellido" name="apellido" register={register} error={errors.apellido} />
                                    <InputGroup label="CUIL" name="cuil" type="number" register={register} error={errors.cuil} />
                                    <InputGroup label="Nacimiento" name="fechaNacimiento" type="date" register={register} error={errors.fechaNacimiento} />
                                </div>
                            </div>

                            {/* Bank */}
                            <div className="border border-gray-200 rounded-xl p-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Datos Bancarios
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputGroup label="Banco" name="banco" placeholder="Ej: Galicia" register={register} error={errors.banco} />
                                    <InputGroup label="CBU / CVU" name="cbu" type="number" register={register} error={errors.cbu} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Laboral (Full Width) */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-blue-50/20">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#E85D04]"></span> Datos Laborales
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                <div className="lg:col-span-1">
                                    <InputGroup label="Legajo" name="legajo" register={register} error={errors.legajo} />
                                </div>
                                <div className="lg:col-span-1">
                                    <InputGroup label="Ingreso" name="fechaIngreso" type="date" register={register} error={errors.fechaIngreso} />
                                </div>
                                <div className="lg:col-span-1">
                                    <InputGroup label="Cargo" name="cargo" placeholder="Puesto" register={register} error={errors.cargo} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Modalidad</label>
                                    <select {...register('modalidadContratacion')} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-brand-secondary">
                                        <option value="Tiempo Indeterminado">Indeterminado</option>
                                        <option value="Plazo Fijo">Plazo Fijo</option>
                                        <option value="Eventual">Eventual</option>
                                    </select>
                                </div>
                                <div className="lg:col-span-1">
                                    <InputGroup label="Bruto" name="sueldoBruto" type="number" step="0.01" register={register} error={errors.sueldoBruto} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions (Fixed at bottom mobile, sticky here) */}
                        <div className="flex gap-3 pt-2 justify-end">
                            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm bg-[#0F2C4C] text-white font-semibold rounded-lg hover:bg-[#1e4570] shadow-md transition-colors">
                                {loading ? 'Guardando...' : 'Confirmar Alta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeFormModal;
