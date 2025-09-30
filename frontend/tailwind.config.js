/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f5ff',
          100: '#dde7ff',
          200: '#bfd4ff',
          300: '#97b9ff',
          400: '#6d98ff',
          500: '#4a78ff',
          600: '#3057f5',
          700: '#2442d2',
          800: '#2038aa',
          900: '#1d3388',
        },
      },
    },
  },
  plugins: [],
};
