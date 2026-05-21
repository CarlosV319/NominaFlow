import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import InputGroup from '../ui/InputGroup';

const companySchema = z.object({
    razonSocial: z.string().min(2, 'La Razón Social es requerida min 2 caracteres'),
    cuit: z.string().regex(/^\d{11}$/, 'CUIT inválido (Debe contener 11 números sin guiones)'),
    domicilio: z.string().min(5, 'El domicilio es requerido'),
    inicioActividades: z.string().refine((val) => !isNaN(Date.parse(val)), "Fecha inválida"),
    tipoEmpleador: z.string().optional().default('mipyme'),
    cct: z.string().optional().default(''),
});

const CreateCompanyModal = ({ isOpen, onClose, onCreate, loading }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(companySchema),
    });

    const onSubmit = (data) => {
        onCreate(data);
        reset(); // Clear form after submit (or wait for success)
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-[#0F2C4C] mb-2">Nueva Empresa</h2>
                <p className="text-gray-500 text-sm mb-6">Completa los datos fiscales de la empresa.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputGroup
                        label="Razón Social"
                        name="razonSocial"
                        placeholder="Mi Empresa S.A."
                        register={register}
                        error={errors.razonSocial}
                    />

                    <InputGroup
                        label="CUIT (Sin guiones)"
                        name="cuit"
                        placeholder="20123456789"
                        type="number" // Helps mobile keyboard, but Zod validates string format
                        register={register}
                        error={errors.cuit}
                    />

                    <InputGroup
                        label="Domicilio Fiscal"
                        name="domicilio"
                        placeholder="Av. Corrientes 1234, CABA"
                        register={register}
                        error={errors.domicilio}
                    />

                    <InputGroup
                        label="Inicio de Actividades"
                        name="inicioActividades"
                        type="date"
                        register={register}
                        error={errors.inicioActividades}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">Tipo de Empleador (Contribuciones)</label>
                            <select
                                {...register('tipoEmpleador')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                            >
                                <option value="mipyme">MiPyME y Otros (18%)</option>
                                <option value="gran_empresa_servicios">Servicios/Comercio Gran Empresa (20.4%)</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-700 mb-1">Convenio Colectivo Principal</label>
                            <select
                                {...register('cct')}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
                            >
                                <option value="">Fuera de Convenio</option>
                                <option value="130/75">Empleados de Comercio (130/75)</option>
                                <option value="260/75">Metalúrgicos UOM (260/75)</option>
                                <option value="40/89">Camioneros (40/89)</option>
                                <option value="389/04">Gastronómicos UTHGRA (389/04)</option>
                                <option value="76/75">Construcción UOCRA (76/75)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#0F2C4C] text-white font-semibold rounded-lg hover:bg-[#1e4570] transition-colors shadow-md"
                        >
                            {loading ? 'Guardando...' : 'Crear Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCompanyModal;
