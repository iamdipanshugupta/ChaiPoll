/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      colors: {
        chai: {
          orange: "#f97316",
          amber: "#fb923c",
          dark: "#1c0a00",
          cream: "#fef3c7",
        }
      },
      opacity: {  
        '4': '0.04',
        '6': '0.06',
        '8': '0.08',  
        '12': '0.12',
        '15': '0.15',
      }
    },
  },
  plugins: [],
}