/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "hsl(245, 58%, 97%)",
          100: "hsl(245, 58%, 92%)",
          200: "hsl(245, 58%, 83%)",
          300: "hsl(245, 58%, 72%)",
          400: "hsl(245, 58%, 62%)",
          500: "hsl(245, 58%, 51%)",
          600: "hsl(245, 58%, 43%)",
          700: "hsl(245, 58%, 35%)",
          800: "hsl(245, 58%, 26%)",
          900: "hsl(245, 58%, 18%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
