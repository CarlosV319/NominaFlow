import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchCompanies, createCompany, deleteCompany, setActiveCompany } from '../../store/slices/companySlice';
import CompanyCard from '../../components/companies/CompanyCard';
import CreateCompanyModal from '../../components/companies/CreateCompanyModal';
import { Plus, Building2, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CompanyListPage = () => {
    const dispatch = useAppDispatch();
    const { companies, activeCompany, loading, error } = useAppSelector((state) => state.company);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(typeof error === 'string' ? error : 'Error operando empresas');
    }, [error]);

    const handleCreate = async (data) => {
        const result = await dispatch(createCompany(data));
        if (createCompany.fulfilled.match(result)) {
            toast.success('¡Empresa creada con éxito!');
            setIsModalOpen(false);
            // Optionally auto-select the new company
            dispatch(setActiveCompany(result.payload));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.')) {
            const result = await dispatch(deleteCompany(id));
            if (deleteCompany.fulfilled.match(result)) {
                toast.success('Empresa eliminada');
            }
        }
        // TODO: Could use a better modal for confirmation
    };

    const handleSelect = (company) => {
        dispatch(setActiveCompany(company));
        toast.success(`Contexto cambiado a: ${company.razonSocial}`);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-bold text-[12px] text-[#0F2C4C]">Mis Empresas</h1>
                    <p className="text-[10px] text-gray-500 mt-1">Administra tus organizaciones y selecciona con cuál trabajar.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-[#E85D04] text-[10px] text-white rounded-lg font-bold shadow-lg shadow-orange-900/20 hover:bg-[#d15403] hover:-translate-y-1 transition-all"
                    >
                        <Plus size={14} className="mr-1.5" />
                        Nueva Empresa
                    </button>
                </div>
            </div>

            {/* List Content */}
            {loading && companies.length === 0 ? (
                <div className="text-center py-20 text-[10px] text-gray-500">Cargando empresas...</div>
            ) : companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <Building2 size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-[12px] font-bold text-gray-700 mb-1">Aún no tienes empresas</h3>
                    <p className="text-[10px] text-gray-500 max-w-md text-center mb-4">Comienza creando tu primera empresa para gestionar empleados y recibos.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[10px] text-[#E85D04] font-bold hover:underline"
                    >
                        Crear mi primera empresa
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <CompanyCard
                            key={company._id}
                            company={company}
                            isActive={activeCompany?._id === company._id}
                            onSelect={handleSelect}
                            onDelete={handleDelete}
                            onEdit={(c) => toast('Edición pronto...', { icon: '🚧' })} // Placeholder logic
                        />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <CreateCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
                loading={loading}
            />
        </div>
    );
};

export default CompanyListPage;
