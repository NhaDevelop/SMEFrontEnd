import type { Config } from 'tailwindcss'

const brandGreen = {
    50: '#f0f9f7',
    100: '#d1ede6',
    200: '#a3dbce',
    300: '#75c9b6',
    400: '#47b79e',
    500: '#05624e', // Primary Brand Green
    600: '#044f3f',
    700: '#033b2f',
    800: '#022820',
    900: '#011410',
    DEFAULT: '#05624e',
};

export default {
    content: [
        './app/**/*.{vue,js,ts,jsx,tsx}',
        './components/**/*.{vue,js,ts,jsx,tsx}',
        './layouts/**/*.{vue,js,ts,jsx,tsx}',
        './pages/**/*.{vue,js,ts,jsx,tsx}',
        './plugins/**/*.{ts,js}',
        './nuxt.config.{js,ts}',
    ],
    theme: {
        extend: {
            colors: {
                primary: brandGreen,
                teal: brandGreen,
                emerald: brandGreen,
                green: brandGreen,
                secondary: {
                    50: '#fdfcf0',
                    100: '#fbf7d1',
                    200: '#f7efa3',
                    300: '#f3e775',
                    400: '#efdf47',
                    500: '#ebe505',
                    600: '#bdb704',
                    700: '#8d8903',
                    800: '#5e5b02',
                    900: '#2f2d01',
                    DEFAULT: '#ebe505',
                },
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',
                dark: {
                    DEFAULT: '#111827',
                    gray: '#1f2937',
                    bg: '#0f172a',
                },
                light: '#f8fafc',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config

