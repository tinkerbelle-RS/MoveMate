/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5eeaca',
          400: '#2dd4b3',
          500: '#14b89f',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        mint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          700: '#0f766e',
        },
        canvas: '#f7fbfa',
        risk: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
