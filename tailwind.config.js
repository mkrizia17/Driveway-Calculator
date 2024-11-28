/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        border: '#your-custom-color', // Define your custom border color here
      },
    },
  },
  plugins: [],
};