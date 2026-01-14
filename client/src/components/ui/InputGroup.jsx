import React from 'react';

const InputGroup = ({
    label,
    name,
    type = 'text',
    placeholder,
    register,
    error,
    disabled = false,
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-xs font-semibold text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...register(name)}
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 
          ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-brand-secondary focus:ring-brand-secondary/20'
                    }
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white'}
        `}
            />
            {error && (
                <span className="text-xs text-red-500 mt-1 block">
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default InputGroup;
