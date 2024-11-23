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
        panel: {
          DEFAULT: '#1f2937',
        },
        header: {
          DEFAULT: '#111827',
        },
      },
    },
  },
  plugins: [],
};