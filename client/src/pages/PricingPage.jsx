import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
    const plans = [
        {
            id: 'monotributista',
            name: 'Monotributista',
            description: 'Para contadores independientes.',
            price: '$5 USD',
            period: '/mes',
            features: ['Hasta 5 Empresas', 'Liquidación Básica', 'Soporte por Email'],
            buttonText: 'Elegir Plan',
            buttonStyle: 'outline',
            highlight: false,
        },
        {
            id: 'estudio',
            name: 'Estudio Contable',
            description: 'Potencia tu estudio con herramientas pro.',
            price: '$15 USD',
            period: '/mes',
            features: [
                'Empresas Ilimitadas',
                'Generación de PDFs en lote',
                'Multi-usuario',
                'Soporte Prioritario',
                'Migración Asistida'
            ],
            buttonText: 'Empezar Prueba Gratis',
            buttonStyle: 'secondary',
            highlight: true,
            tag: 'Más Popular',
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Soluciones a medida para grandes volúmenes.',
            price: 'Consultar',
            period: '',
            features: [
                'API Access',
                'Soporte 24/7',
                'SLA Garantizado',
                'Auditoría Avanzada',
                'Capacitación Dedicada'
            ],
            buttonText: 'Contactar Ventas',
            buttonStyle: 'primary',
            highlight: false,
        },
    ];

    return (
        <div className="bg-brand-bg min-h-screen py-10 md:py-16 px-4">
            <div className="layout-container max-w-6xl mx-auto">
                <div className="text-center mb-10 md:mb-14">
                    <h1 className="text-xl md:text-3xl font-bold text-brand-primary mb-3">
                        Planes Flexibles para tu Crecimiento
                    </h1>
                    <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Elige el plan que mejor se adapte a tus necesidades. Sin contratos a largo plazo, cancela cuando quieras.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${plan.highlight ? 'border border-brand-secondary md:scale-105 z-10' : 'border border-gray-100'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-secondary text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                                    {plan.tag}
                                </div>
                            )}

                            <div className="text-center mb-5">
                                <h3 className="text-sm font-bold text-brand-primary mb-1">{plan.name}</h3>
                                <p className="text-xs text-gray-400 mb-3">{plan.description}</p>
                                <div className="flex justify-center items-baseline text-brand-primary">
                                    <span className="text-2xl font-bold">{plan.price}</span>
                                    <span className="text-xs text-gray-400 ml-1">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg
                                            className="h-3.5 w-3.5 text-brand-secondary mr-2 mt-0.5 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-xs text-gray-600 leading-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="text-center">
                                <Link
                                    to={`/register?plan=${plan.id}`}
                                    className={`block w-full py-2.5 px-4 rounded-md text-xs font-bold transition-colors duration-300 ${plan.buttonStyle === 'secondary'
                                        ? 'bg-brand-secondary text-white hover:bg-opacity-90'
                                        : plan.buttonStyle === 'primary'
                                            ? 'bg-brand-primary text-white hover:bg-opacity-90'
                                            : 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
                                        }`}
                                >
                                    {plan.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
