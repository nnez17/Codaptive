/** @type {import('tailwindcss').Config} */
export default {
  presets: ["@tailwindcss/vega"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "bounce-subtle": "bounce-subtle 4s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
