/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cinzel'", "Georgia", "serif"],
        mono: ["'IBM Plex Mono'", "Consolas", "monospace"],
      },
      colors: {
        void: "#070711",
        ink: "#10101d",
        panel: "#151527",
        neonCyan: "#2cf7ff",
        neonPink: "#ff3fbd",
        acid: "#98ff56",
        oldGold: "#c69a41",
        blood: "#d7264d",
      },
      boxShadow: {
        neon: "0 0 24px rgba(44, 247, 255, 0.35)",
        pink: "0 0 24px rgba(255, 63, 189, 0.35)",
        gold: "0 0 18px rgba(198, 154, 65, 0.28)",
      },
      animation: {
        rain: "rain 900ms linear infinite",
        scan: "scan 7s linear infinite",
        pulseSlow: "pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
