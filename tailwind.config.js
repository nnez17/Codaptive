/** @type {import('tailwindcss').Config} */
export default {
  presets: ["@tailwindcss/vega"],
  content: [
    "./index.html",
    "./frontend/**/*.{js,ts,jsx,tsx}",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      animation: {
        "bounce-subtle": "bounce-subtle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
