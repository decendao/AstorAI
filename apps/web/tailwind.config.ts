import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 深空黑 + 金 (3A 联盟主基调)
        ink: {
          950: "#05060a",
          900: "#0a0d14",
          800: "#11151f",
          700: "#1a2030",
          600: "#252b3b",
        },
        gold: {
          50: "#fff8e7",
          100: "#fde9b8",
          300: "#f4cf78",
          500: "#d4a64a", // 主金
          600: "#b8862f",
          700: "#8a6422",
        },
        neon: {
          cyan: "#7ee6e9",
          violet: "#a78bfa",
          rose: "#fb7185",
        },
        // Apple Health 浅色 (报告区用)
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(ellipse at top, rgba(212,166,74,0.18), transparent 60%)",
        "ink-radial":
          "radial-gradient(ellipse at bottom, rgba(126,230,233,0.10), transparent 60%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "33%": { transform: "translateY(-12px) translateX(8px)" },
          "66%": { transform: "translateY(8px) translateX(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;