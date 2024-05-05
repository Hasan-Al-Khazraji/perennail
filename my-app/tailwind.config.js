/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abc: ["Inter", "sans-serif"]
      },
      colors: {
        primary: "#00dd9e",
      }
    },
  },
  plugins: [],
}

