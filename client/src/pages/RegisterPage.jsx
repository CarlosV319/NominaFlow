import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { registerUser } from '../store/slices/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import InputGroup from '../components/ui/InputGroup';

// Validations
const registerSchema = z.object({
    firstName: z.string().min(2, 'Minimo 2 caracteres'),
    lastName: z.string().min(2, 'Minimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string()
        .min(6, 'Mínimo 6 caracteres')
        .regex(/[A-Z]/, 'Debe tener una mayúscula')
        .regex(/[0-9]/, 'Debe tener un número')
        .regex(/[^A-Za-z0-9]/, 'Debe tener un caracter especial'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedPlan = searchParams.get('plan'); // Capture plan from URL

    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Error al registrarse');
        }
    }, [error]);

    const onSubmit = async (data) => {
        // Add plan info if needed, or handle it post-registration
        const userData = { ...data, plan: selectedPlan || 'monotributista' };

        // Removing confirmPassword before sending
        const { confirmPassword, ...payload } = userData;

        const result = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(result)) {
            toast.success('¡Cuenta creada exitosamente!');
        }
    };

    return (
        <AuthLayout
            title="Crear Cuenta Gratis"
            subtitle={selectedPlan ? `Registrando para el plan: ${selectedPlan.toUpperCase()}` : "Únete a NominaFlow hoy mismo."}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                    <InputGroup
                        label="Nombre"
                        name="firstName"
                        placeholder="Juan"
                        register={register}
                        error={errors.firstName}
                    />
                    <InputGroup
                        label="Apellido"
                        name="lastName"
                        placeholder="Pérez"
                        register={register}
                        error={errors.lastName}
                    />
                </div>

                <InputGroup
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    register={register}
                    error={errors.email}
                    autoComplete="email"
                />

                <InputGroup
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    error={errors.password}
                    autoComplete="new-password"
                />

                <InputGroup
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300
            ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-brand-secondary hover:bg-opacity-90 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
                </button>

                <p className="text-center text-xs text-gray-600 mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-brand-primary font-bold hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
