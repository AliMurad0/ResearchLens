/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "rgb(var(--color-paper) / <alpha-value>)",
          dim: "rgb(var(--color-paper-dim) / <alpha-value>)",
          line: "rgb(var(--color-paper-line) / <alpha-value>)",
        },
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          soft: "rgb(var(--color-ink-soft) / <alpha-value>)",
          faint: "rgb(var(--color-ink-faint) / <alpha-value>)",
        },
        lamp: {
          DEFAULT: "rgb(var(--color-lamp) / <alpha-value>)",
          light: "rgb(var(--color-lamp-light) / <alpha-value>)",
          dark: "rgb(var(--color-lamp-dark) / <alpha-value>)",
          tint: "rgb(var(--color-lamp-tint) / <alpha-value>)",
        },
        stamp: {
          DEFAULT: "rgb(var(--color-stamp) / <alpha-value>)",
          tint: "rgb(var(--color-stamp-tint) / <alpha-value>)",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "ui-serif", "Georgia", "serif"],
        sans: ["Public Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.05)",
        float: "0 12px 40px rgba(0, 0, 0, 0.18)",
        lamp: "0 8px 30px -4px rgb(var(--color-lamp) / 0.35)",
      },
    },
  },
  plugins: [],
};

