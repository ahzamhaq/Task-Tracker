/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        bg: {
          DEFAULT: "#0F172A",
          light: "#F8FAFC",
        },
        surface: {
          DEFAULT: "#1E293B",
          light: "#FFFFFF",
        },
        border: {
          DEFAULT: "#334155",
          light: "#E2E8F0",
        },
        ink: {
          DEFAULT: "#F8FAFC",
          muted: "#CBD5E1",
          light: "#0F172A",
          "light-muted": "#475569",
        },
        brand: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        card: "14px",
        btn: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.02)",
        "card-hover":
          "0 8px 24px -8px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.25)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};
