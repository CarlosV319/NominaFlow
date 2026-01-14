import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { loginUser } from '../store/slices/authSlice';
import AuthLayout from '../components/layout/AuthLayout';
import InputGroup from '../components/ui/InputGroup';

// Validations
const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Error al iniciar sesión');
        }
    }, [error]);

    const onSubmit = async (data) => {
        const result = await dispatch(loginUser(data));
        if (loginUser.fulfilled.match(result)) {
            toast.success('¡Bienvenido de nuevo!'); // Redirect handled by useEffect
        }
    };

    return (
        <AuthLayout
            title="Bienvenido de nuevo"
            subtitle="Ingresa tus credenciales para acceder a tu cuenta."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputGroup
                    label="Correo Electrónico"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    register={register}
                    error={errors.email}
                />

                <InputGroup
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    error={errors.password}
                />

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary" />
                        Recuérdame
                    </label>
                    <Link to="/forgot-password" className="hover:text-brand-secondary">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300
            ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-brand-primary hover:bg-brand-secondary hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    {loading ? 'Cargando...' : 'Ingresar al Sistema'}
                </button>

                <p className="text-center text-xs text-gray-600 mt-6">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-brand-secondary font-bold hover:underline">
                        Regístrate gratis
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
