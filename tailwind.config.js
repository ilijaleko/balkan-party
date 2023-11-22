/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "#2a2867",
        secondary: "#fba919",
      },
    },
  },
  plugins: [],
};
