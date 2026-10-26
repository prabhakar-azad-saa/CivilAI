/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EAE5DB',
          300: '#DCD5C7',
          400: '#B8AF9F',
          500: '#8F8576',
          600: '#696053',
          700: '#4A433A',
          800: '#2E2A24',
          900: '#1A1815',
        },
        charcoal: {
          950: '#0F1012',
          900: '#17191C',
          800: '#22252A',
          700: '#33373E',
          600: '#4D525C',
        },
        olive: {
          50: '#F4F7F4',
          100: '#E4EDE5',
          200: '#C7D9CA',
          500: '#3E5C46',
          600: '#314B38',
          700: '#253B2B',
          800: '#1B2C20',
          900: '#121E16',
        },
        terracotta: {
          50: '#FAF3F0',
          100: '#F5E3DC',
          200: '#EBC3B4',
          500: '#C25E3E',
          600: '#A84A2C',
          700: '#8A3B21',
          800: '#6E2D17',
        },
        sand: {
          50: '#FDFCF9',
          100: '#F7F4EE',
          200: '#EFECE3',
          300: '#E2DCD0',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 20px -2px rgba(23, 25, 28, 0.08), 0 2px 6px -1px rgba(23, 25, 28, 0.04)',
        'card': '0 10px 30px -4px rgba(23, 25, 28, 0.06)',
      }
    },
  },
  plugins: [],
}
