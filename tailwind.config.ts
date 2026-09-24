import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* MB TECHNIC palette — dark premium automotive */
        ink: "#06070A",
        graphite: "#0C0E12",
        steel: "#14181D",
        plate: "#1C2127",
        silver: "#C8CCD2",
        chrome: "#E9EBEE",
        accent: "#2F62FF",
        "accent-dim": "#1B3EA8",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        ultra: "0.42em",
      },
      fontSize: {
        /* editorial scale */
        "display-xl": ["clamp(3.1rem, 12.2vw, 12.5rem)", { lineHeight: "0.86", letterSpacing: "-0.045em" }],
        "display-l": ["clamp(2.4rem, 7.2vw, 6.4rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-m": ["clamp(1.9rem, 4.4vw, 3.4rem)", { lineHeight: "0.94", letterSpacing: "-0.035em" }],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translate3d(0,28px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        sheen: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.5s ease-out both",
        sheen: "sheen 1.6s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
