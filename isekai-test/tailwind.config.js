/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        fantasy: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        scifi: {
          light: '#a5f3fc',
          DEFAULT: '#06b6d4',
          dark: '#0e7490',
        },
        horror: {
          light: '#fecdd3',
          DEFAULT: '#e11d48',
          dark: '#9f1239',
        },
        ancient: {
          light: '#d1d5db',
          DEFAULT: '#6b7280',
          dark: '#374151',
        },
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        scifi: ['Orbitron', 'sans-serif'],
        horror: ['Creepster', 'cursive'],
        ancient: ['Noto Serif', 'serif'],
        modern: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'fantasy-pattern': "url('/src/assets/fantasy-bg.jpg')",
        'scifi-pattern': "url('/src/assets/scifi-bg.jpg')",
        'horror-pattern': "url('/src/assets/horror-bg.jpg')",
        'ancient-pattern': "url('/src/assets/ancient-bg.jpg')",
      },
    },
  },
  plugins: [],
} 