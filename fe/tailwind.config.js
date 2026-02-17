/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E40AF',
                    light: '#3B82F6',
                    dark: '#1E3A8A',
                },
                secondary: {
                    DEFAULT: '#F97316',
                    light: '#FB923C',
                    dark: '#EA580C',
                },
                neu: {
                    base: '#e0e5ec',
                    text: '#4a4a4a',
                    highlight: '#ffffff',
                    shadow: '#a3b1c6',
                },
                neutral: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                }
            },
            boxShadow: {
                'neu-out': '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
                'neu-in': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
                'neu-pressed': 'inset 4px 4px 8px rgba(163,177,198, 0.6), inset -4px -4px 8px rgba(255,255,255, 0.8)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {

            },
            animation: {
                shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                }
            }
        },
    },
    plugins: [],
}
