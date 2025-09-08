/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./client/index.html"
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