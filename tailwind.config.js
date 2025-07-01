/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'beedab-black': '#000000',
        'beedab-blue': '#4A90E2',
        'beedab-lightblue': '#6BB6FF',
        'beedab-darkblue': '#2E5B94',
        'beedab-accent': '#87CEEB',
      },
    },
  },
  plugins: [],
}