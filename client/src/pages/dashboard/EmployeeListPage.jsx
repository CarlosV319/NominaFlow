import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchEmployees, createEmployee, deleteEmployee } from '../../store/slices/employeeSlice';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeFormModal from '../../components/employees/EmployeeFormModal';
import { UserPlus, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const EmployeeListPage = () => {
    const dispatch = useAppDispatch();
    const { activeCompany } = useAppSelector((state) => state.company);
    const { employees, loading, error } = useAppSelector((state) => state.employee);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (activeCompany) {
            dispatch(fetchEmployees(activeCompany._id));
        }
    }, [activeCompany, dispatch]);

    useEffect(() => {
        if (error) toast.error(typeof error === 'string' ? error : 'Error operando empleados');
    }, [error]);

    const handleCreate = async (data) => {
        const result = await dispatch(createEmployee(data));
        if (createEmployee.fulfilled.match(result)) {
            toast.success('Empleado dado de alta');
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar empleado? Esta acción no se puede deshacer.')) {
            const result = await dispatch(deleteEmployee(id));
            if (deleteEmployee.fulfilled.match(result)) {
                toast.success('Empleado eliminado');
            }
        }
    };

    // 1. Empty State - No Company Selected
    if (!activeCompany) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
                    <Building size={64} className="text-[#0F2C4C]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecciona una Empresa</h2>
                <p className="text-gray-500 max-w-md mb-6">
                    Para gestionar empleados, primero debes indicar sobre qué empresa quieres trabajar usando el selector superior.
                </p>
                <Link to="/dashboard/companies" className="text-brand-secondary font-bold hover:underline">
                    Ir a Mis Empresas
                </Link>
            </div>
        );
    }

    // 2. Main View
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-bold text-[#0F2C4C]">Empleados</h1>
                    <p className="text-gray-500 mt-1">
                        Gestión de nómina para <span className="font-semibold text-brand-secondary">{activeCompany.razonSocial}</span>
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center px-6 py-3 bg-[#E85D04] text-white rounded-xl font-bold shadow-lg shadow-orange-900/20 hover:bg-[#d15403] hover:-translate-y-1 transition-all"
                >
                    <UserPlus size={20} className="mr-2" />
                    Nuevo Empleado
                </button>
            </div>

            {/* List */}
            {loading && employees.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Cargando nómina...</div>
            ) : (
                <EmployeeTable
                    employees={employees}
                    onDelete={handleDelete}
                    onEdit={() => toast.success('Próximamente: Edición')}
                />
            )}

            {/* Modal */}
            {/* Modal */}

            <EmployeeFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
                loading={loading}
                activeCompanyId={activeCompany._id}
            />
        </div>
    );
};

export default EmployeeListPage;
