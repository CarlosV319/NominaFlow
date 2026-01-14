import { z } from 'zod';

export const createCompanySchema = z.object({
    body: z.object({
        razonSocial: z.string().min(1, 'Razón Social requerida'),
        cuit: z.string().length(11, 'CUIT debe tener 11 dígitos').regex(/^\d+$/, 'Solo números'),
        domicilio: z.object({
            calle: z.string(),
            altura: z.string(),
            cp: z.string(),
            localidad: z.string(),
        }),
    }),
});
