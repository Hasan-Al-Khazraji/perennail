/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abc: ["Inter", "sans-serif"]
      },
      colors: {
        primary: "#00dd9e",
        secondary: "#f1ead0",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

