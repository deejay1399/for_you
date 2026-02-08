import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#090c1d",
        navy: "#10182f",
        blush: "#f4b4c7",
        rose: "#ff6b9f",
        pearl: "#f9f8ff"
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 117, 157, 0.28)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        drift: "drift 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
