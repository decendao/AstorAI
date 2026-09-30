import type { Config } from "tailwindcss";

/**
 * AstorAI Design Tokens
 * 基调：深黑 (#0E0C0A) + 哑金 (#B8956A) + 米白 (#E5DDC8)
 * 风格：编辑排版 — 超大字号 / 极致留白 / 金色斜体高亮 / 发丝线
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 暖墨黑 (继承 3A 联盟基调)
        ink: {
          950: "#0A0908",
          900: "#0E0C0A", // 主背景
          800: "#141210",
          700: "#1A1815",
          600: "#221F1B",
        },
        // 羊皮纸
        paper: {
          DEFAULT: "#E5DDC8",
          dim: "rgba(229,221,200,0.58)",
          dimmer: "rgba(229,221,200,0.36)",
        },
        // 哑金
        gold: {
          50: "#F7F1E4",
          100: "#EFE4CB",
          300: "#D4B48C",
          500: "#B8956A", // 主金
          600: "#A6853A",
          700: "#8A6F45",
          800: "#6E5723",
        },
      },
      fontFamily: {
        // 中文：思源宋体（粗黑体标题）
        sans: ["var(--font-noto-serif-sc)", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        // 英文/数字：Cormorant Garamond 斜体衬线
        display: ["var(--font-cormorant)", "Georgia", "Times New Roman", "serif"],
      },
      fontSize: {
        "display-lg": ["clamp(34px,7.4vw,84px)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(28px,5.4vw,60px)", { lineHeight: "1.14", letterSpacing: "-0.012em" }],
        "display-sm": ["clamp(22px,3.6vw,40px)", { lineHeight: "1.2", letterSpacing: "-0.008em" }],
        "hero-aaa": ["clamp(72px,20vw,190px)", { lineHeight: "0.88", letterSpacing: "0.04em" }],
      },
      letterSpacing: {
        hairline: "0.24em",
        wide2: "0.18em",
      },
      borderColor: {
        hair: "rgba(184,149,106,0.18)",
        "hair-strong": "rgba(184,149,106,0.32)",
        "hair-faint": "rgba(184,149,106,0.12)",
      },
      backgroundImage: {
        "gold-faint":
          "linear-gradient(90deg, rgba(184,149,106,0.18) 1px, transparent 1px), linear-gradient(rgba(184,149,106,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "88px 88px",
      },
      keyframes: {
        floatA: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(-60px,50px) scale(1.12)" },
          "66%": { transform: "translate(40px,90px) scale(0.94)" },
          "100%": { transform: "translate(-30px,20px) scale(1.06)" },
        },
        floatB: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(70px,-50px) scale(1.14)" },
          "100%": { transform: "translate(-50px,-30px) scale(0.92)" },
        },
        floatC: {
          "0%,100%": { transform: "translate(0,0)" },
          "40%": { transform: "translate(-80px,-60px)" },
          "70%": { transform: "translate(60px,-20px)" },
          "100%": { transform: "translate(20px,70px)" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(34px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        barFill: {
          from: { width: "0%" },
        },
        ringFill: {
          from: { strokeDashoffset: "339.29" },
        },
      },
      animation: {
        "float-a": "floatA 30s cubic-bezier(.4,0,.2,1) infinite alternate",
        "float-b": "floatB 36s cubic-bezier(.4,0,.2,1) infinite alternate",
        "float-c": "floatC 24s cubic-bezier(.4,0,.2,1) infinite alternate",
        rise: "rise 0.9s cubic-bezier(.4,0,.2,1) both",
        "pulse-soft": "pulseSoft 4s cubic-bezier(.4,0,.2,1) infinite",
        "bar-fill": "barFill 1.4s cubic-bezier(.4,0,.2,1) forwards",
        "ring-fill": "ringFill 1.8s cubic-bezier(.4,0,.2,1) forwards",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
        38: "9.5rem",
      },
      maxWidth: {
        prose: "820px",
        shell: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
