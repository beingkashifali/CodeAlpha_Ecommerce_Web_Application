/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*/.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f4",
          100: "#dcece2",
          200: "#b8d9c6",
          300: "#8cbfa3",
          400: "#5c9d7c",
          500: "#3a7f5f",
          600: "#2a6449",
          700: "#1f4d38", // primary brand green
          800: "#193f2e",
          900: "#143327",
        },
        maroon: {
          500: "#8a2c3b",
          600: "#732433",
          700: "#5c1c28",
        },
        sale: "#e0793e",
      },
      fontFamily: {
        heading: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 30, 24, 0.06), 0 4px 12px rgba(15, 30, 24, 0.06)",
      },
    },
  },
  plugins: [],
};
