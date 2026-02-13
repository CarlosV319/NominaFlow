export const plans = [
    {
        id: 'inicial',
        name: 'Inicial',
        tagline: 'El Gancho / Freemium',
        description: 'Ideal para estudiantes o contadores que quieren probar el sistema.',
        price: 'Gratis',
        priceNumber: 0,
        period: '',
        limits: {
            companies: 1,
            receipts: 5,
            history: '3 meses'
        },
        features: [
            '1 Empresa',
            'Hasta 5 Recibos/mes',
            'Historial de 3 meses',
            'Carga manual de conceptos',
            'PDF con marca de agua'
        ],
        buttonText: 'Empezar Gratis',
        buttonStyle: 'outline',
        highlight: false,
        recommended: false
    },
    {
        id: 'profesional',
        name: 'Profesional',
        tagline: 'El Rentable / Monotributista',
        description: 'Para contadores independientes que inician.',
        price: '$8 USD',
        priceNumber: 8,
        period: '/mes',
        limits: {
            companies: 10,
            receipts: 50,
            history: '1 Año'
        },
        features: [
            'Hasta 10 Empresas',
            'Hasta 50 Recibos/mes',
            'Historial de 1 Año',
            'Sin marca de agua',
            'Descarga Original/Duplicado',
            'Soporte por Email'
        ],
        buttonText: 'Elegir Plan',
        buttonStyle: 'primary',
        highlight: false,
        recommended: false
    },
    {
        id: 'estudio',
        name: 'Estudio',
        tagline: 'El Escalamiento / PyME',
        description: 'Para estudios contables consolidados.',
        price: '$29 USD',
        priceNumber: 29,
        period: '/mes',
        limits: {
            companies: 50,
            receipts: 500,
            history: '5 Años'
        },
        features: [
            'Hasta 50 Empresas',
            'Hasta 500 Recibos/mes',
            'Historial de 5 Años (Legal)',
            'Generación Masiva de Recibos',
            'Exportación Libro Sueldos (TXT)',
            'Envío automático por email (Próx.)'
        ],
        buttonText: 'Prueba Gratis 7 Días',
        buttonStyle: 'secondary',
        highlight: true,
        recommended: true,
        badge: 'Más Popular'
    },
    {
        id: 'corporate',
        name: 'Corporate',
        tagline: 'Sin Límites / Enterprise',
        description: 'Grandes empresas o estudios fábrica.',
        price: '$99 USD',
        priceNumber: 99,
        period: '/mes',
        limits: {
            companies: 'Ilimitadas',
            receipts: 2000,
            history: 'Ilimitado'
        },
        features: [
            'Empresas Ilimitadas',
            'Hasta 2.000 Recibos/mes',
            'Historial Permanente',
            'Marca Blanca (Tu Logo)',
            'Acceso a API',
            'Soporte Prioritario (WhatsApp)'
        ],
        buttonText: 'Contactar Ventas',
        buttonStyle: 'primary',
        highlight: false,
        recommended: false
    }
];
