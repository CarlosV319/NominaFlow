import React, { useState } from 'react';
import { MoreVertical, CheckCircle, Edit, Trash2 } from 'lucide-react';

const CompanyCard = ({ company, isActive, onSelect, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className={`relative bg-white rounded-xl transition-all duration-300 ${isActive
                    ? 'shadow-lg border-2 border-brand-secondary ring-2 ring-brand-secondary/10'
                    : 'shadow-md hover:shadow-lg border border-gray-100 hover:border-gray-200'
                }`}
        >
            {/* Active Badge */}
            {isActive && (
                <div className="absolute -top-3 left-4 bg-brand-secondary text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm flex items-center">
                    <CheckCircle size={12} className="mr-1" /> Seleccionada
                </div>
            )}

            <div className="p-6">
                {/* Header with Title and Menu */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1" title={company.razonSocial}>
                        {company.razonSocial}
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                                    <button
                                        onClick={() => { onEdit(company); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                    >
                                        <Edit size={14} className="mr-2" /> Editar
                                    </button>
                                    <button
                                        onClick={() => { onDelete(company._id); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <Trash2 size={14} className="mr-2" /> Borrar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Info List */}
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p><span className="font-semibold">CUIT:</span> {company.cuit}</p>
                    <p className="line-clamp-1" title={company.domicilio}>
                        <span className="font-semibold">Domicilio:</span> {company.domicilio}
                    </p>
                </div>

                {/* Primary Action Button */}
                <button
                    onClick={() => !isActive && onSelect(company)}
                    disabled={isActive}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${isActive
                            ? 'bg-gray-100 text-gray-400 cursor-default'
                            : 'bg-[#0F2C4C] text-white hover:bg-[#1e4570]'
                        }`}
                >
                    {isActive ? 'Empresa Activa' : 'Seleccionar'}
                </button>
            </div>
        </div>
    );
};

export default CompanyCard;
