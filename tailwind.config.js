
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/src/components/**/*.{js,ts,jsx,tsx}",
    "./client/src/pages/**/*.{js,ts,jsx,tsx}",
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
