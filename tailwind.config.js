/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                oknbs: {
                    // Foundations
                    void: '#000000',
                    slate: '#0f172a',
                    graphite: '#18181b',
                    // Accents
                    red: '#EF4444',
                    teal: '#14B8A6',
                    yellow: '#EAB308',
                    // Text
                    white: '#FFFFFF',
                    muted: '#94A3B8',
                    dimmed: '#475569',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
