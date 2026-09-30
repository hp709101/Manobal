/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        manobal: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          primary: '#10b981',
          accent: '#0284c7',
          warning: '#f59e0b',
          danger: '#ef4444',
          subtle: '#64748b'
        }
      }
    },
  },
  plugins: [],
}

