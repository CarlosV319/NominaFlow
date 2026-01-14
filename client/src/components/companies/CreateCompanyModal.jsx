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
