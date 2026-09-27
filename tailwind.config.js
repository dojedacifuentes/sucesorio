/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Oxanium Variable'", "Oxanium", "'Segoe UI'", "system-ui", "sans-serif"],
        sans: ["'Inter Variable'", "Inter", "'Segoe UI'", "system-ui", "-apple-system", "Roboto", "sans-serif"],
      },
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        raised: token("raised"),
        line: token("line"),
        ink: token("ink"),
        dim: token("dim"),
        faint: token("faint"),
        cyan: token("cyan"),
        blue: token("blue"),
        indigo: token("indigo"),
        violet: token("violet"),
        lilac: token("lilac"),
        magenta: token("magenta"),
        ok: token("ok"),
        bad: token("bad"),
        warn: token("warn"),
        paper: token("paper"),
        paperInk: token("paper-ink"),
      },
      borderRadius: {
        panel: "14px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--c-cyan) / 0.45), 0 0 22px rgb(var(--c-cyan) / 0.22)",
        glowViolet: "0 0 0 1px rgb(var(--c-violet) / 0.55), 0 0 22px rgb(var(--c-violet) / 0.25)",
        glowMagenta: "0 0 0 1px rgb(var(--c-magenta) / 0.55), 0 0 22px rgb(var(--c-magenta) / 0.25)",
        panel: "0 18px 50px rgb(0 0 0 / 0.45)",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
