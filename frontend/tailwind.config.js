/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "bg-orange-500",
    "hover:bg-orange-600",
    "bg-gray-300",
    "text-gray-600",
    "cursor-not-allowed",
    "bg-blue-500",
    "hover:bg-blue-600",
    "text-white",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
