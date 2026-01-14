/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#0F2C4C', // Azul Marino Corporativo
                    secondary: '#E85D04', // Naranja Acción
                    bg: '#F8FAFC', // Blanco Suave/Off-white
                }
            },
            keyframes: {
                smoke: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                }
            },
            animation: {
                smoke: 'smoke 15s ease infinite',
            }
        },
    },
    plugins: [],
}
