/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rural: {
          dark: '#1b5e20',
          DEFAULT: '#2e7d32',
          light: '#4caf50',
          pale: '#e8f5e9',
          border: '#c8e6c9'
        },
        solar: {
          dark: '#b23c00',
          DEFAULT: '#e65100',
          light: '#ff7d47',
          pale: '#fff3e0'
        },
        khadi: {
          dark: '#0d47a1',
          DEFAULT: '#1565c0',
          light: '#42a5f5',
          pale: '#e3f2fd'
        },
        harvest: {
          DEFAULT: '#f9a825',
          light: '#fbc02d',
          pale: '#fffde7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'rural-soft': '0 4px 20px -2px rgba(27, 94, 32, 0.08), 0 2px 6px -1px rgba(27, 94, 32, 0.04)',
        'rural-glow': '0 0 25px rgba(46, 125, 50, 0.25)',
        'solar-glow': '0 0 25px rgba(230, 81, 0, 0.25)'
      }
    },
  },
  plugins: [],
}
