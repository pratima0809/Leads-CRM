import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.8125rem", { lineHeight: "1.25rem" }],
        "base": ["0.875rem", { lineHeight: "1.375rem" }],
        "lg": ["1rem", { lineHeight: "1.5rem" }],
        "xl": ["1.125rem", { lineHeight: "1.625rem" }],
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.5rem", { lineHeight: "2rem" }],
        "4xl": ["2.5rem", { lineHeight: "1.15" }],
      },
      colors: {
        /* ── 60% Neutral Foundation ────────────────────── */
        surface: {
          bg:       "var(--surface-bg)",
          "bg-alt": "var(--surface-bg-alt)",
          card:     "var(--surface-card)",
          popover:  "var(--surface-popover)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          light:   "var(--border-light)",
          divider: "var(--border-divider)",
        },

        /* ── 30% Supporting Colors ─────────────────────── */
        sidebar: {
          DEFAULT: "var(--sidebar)",
          hover:   "var(--sidebar-hover)",
          text:    "var(--sidebar-text)",
          "text-muted": "var(--sidebar-text-muted)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          inverse:   "var(--text-inverse)",
        },
        icon: {
          DEFAULT: "var(--icon-default)",
          muted:   "var(--icon-muted)",
        },

        /* ── 10% Accent Colors ─────────────────────────── */
        accent: {
          DEFAULT: "var(--accent)",
          hover:   "var(--accent-hover)",
          light:   "var(--accent-light)",
          text:    "var(--accent-text)",
        },
        success: {
          DEFAULT: "var(--success)",
          light:   "var(--success-light)",
          border:  "var(--success-border)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          light:   "var(--warning-light)",
          border:  "var(--warning-border)",
        },
        error: {
          DEFAULT: "var(--error)",
          light:   "var(--error-light)",
          border:  "var(--error-border)",
        },
        info: {
          DEFAULT: "var(--info)",
          light:   "var(--info-light)",
          border:  "var(--info-border)",
        },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "14px",
        "2xl": "16px",
      },
      boxShadow: {
        "card":     "var(--shadow-card)",
        "card-hov": "var(--shadow-card-hov)",
        "dropdown": "var(--shadow-dropdown)",
        "modal":    "var(--shadow-modal)",
        "sidebar":  "2px 0 12px rgba(0,0,0,0.06)",
        "none":     "0 0 #0000",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out both",
        "fade-in-up": "fadeInUp 0.25s ease-out both",
        "fade-in-down": "fadeInDown 0.2s ease-out both",
        "slide-in-right": "slideInRight 0.25s ease-out both",
        "slide-in-left": "slideInLeft 0.25s ease-out both",
        "scale-in": "scaleIn 0.2s ease-out both",
        "float": "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 1.5s infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "skeleton": "skeletonPulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
