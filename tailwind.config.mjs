/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6A4C9C', // Imperial Purple
        secondary: '#CD412B', // Vermilion Red
        highlight: '#D4AF37', // Delicate Gold
        'background-light': '#F8F8F4', // Silken White
        'background-dark': '#141118', // Deep Charcoal
        'text-light': '#333333', // Sumi Ink Black
        'text-dark': '#F8F8F4', // Silken White
        'subtle-light': '#6b7280',
        'subtle-dark': '#9ca3af',
        'border-light': '#e5e7eb',
        'border-dark': '#374151',
      },
      fontFamily: {
        display: ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};