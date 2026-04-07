/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      colors: {
        // Deep Ocean Primary (Blue-950 base)
        ocean: {
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
          950: '#082f49',   // Deep ocean (darkest) - Primary bg
        },
        // Sky Blue Accents (Current accent color)
        aqua: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',   // sky-300
          400: '#38bdf8',   // sky-400
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Feature card accent colors
        accent: {
          sky: '#0ea5e9',
          orange: '#fb923c',
          purple: '#a855f7',
          emerald: '#10b981',
        },
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(to bottom, #082f49, #0c4a6e, #075985)',
        'ocean-gradient-light': 'linear-gradient(135deg, #075985 0%, #0c4a6e 100%)',
        'nav-gradient': 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95))',
        'hero-gradient': 'linear-gradient(to bottom, #082f49 0%, #0c4a6e 50%, #075985 100%)',
      },
    },
  },
  plugins: [],
}