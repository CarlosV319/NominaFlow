import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        firstName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
        lastName: z.string().min(2, 'Apellido debe tener al menos 2 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(1, 'Contraseña es requerida'),
    }),
});
