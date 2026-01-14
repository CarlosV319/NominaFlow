import React, { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = employees.filter(emp =>
        emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.legajo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.cuil.includes(searchTerm)
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header & Search */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-gray-700">Nómina Activa ({employees.length})</h3>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o legajo..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="p-4 font-semibold border-b">Legajo</th>
                            <th className="p-4 font-semibold border-b">Empleado</th>
                            <th className="p-4 font-semibold border-b">CUIL</th>
                            <th className="p-4 font-semibold border-b">Cargo</th>
                            <th className="p-4 font-semibold border-b">Estado</th>
                            <th className="p-4 font-semibold border-b text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 font-mono text-gray-600 font-medium">{emp.legajo}</td>
                                    <td className="p-4">
                                        <Link to={`/dashboard/employees/${emp._id}`} className="font-bold text-[#0F2C4C] hover:text-blue-600 hover:underline cursor-pointer">
                                            {emp.apellido}, {emp.nombre}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-gray-600">{emp.cuil}</td>
                                    <td className="p-4 text-gray-600">{emp.cargo}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => onEdit(emp)} className="text-gray-400 hover:text-brand-secondary p-1">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => onDelete(emp._id)} className="text-gray-400 hover:text-red-500 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    {searchTerm ? 'No se encontraron resultados.' : 'No hay empleados registrados.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;
