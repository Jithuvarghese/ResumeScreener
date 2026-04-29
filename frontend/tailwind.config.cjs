/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        sand: '#f6efe7',
        brand: '#0f766e',
        accent: '#f97316',
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'radial-soft': 'radial-gradient(circle at top left, rgba(15, 118, 110, 0.16), transparent 35%), radial-gradient(circle at top right, rgba(249, 115, 22, 0.12), transparent 30%)',
      },
    },
  },
  plugins: [],
};