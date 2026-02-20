/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#f3bc00',
          dark: '#1a1605',
          black: '#0e0c02',
        }
      }
    },
  },
  plugins: [],
}
