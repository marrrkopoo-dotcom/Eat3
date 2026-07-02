/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#f43f5e',
        secondary: '#fb7185',
        accent: '#9f1239',
        darkBg: '#0f172a',
        darkCard: '#1e293b',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(244, 63, 94, 0.5)' },
          '50%': { opacity: .7, boxShadow: '0 0 5px rgba(244, 63, 94, 0.2)' },
        }
      }
    }
  },
  plugins: [],
}
