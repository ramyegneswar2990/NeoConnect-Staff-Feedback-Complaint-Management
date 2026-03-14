import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        white: "#020402", // Deep terminal black
        black: "#00ff00", // Neon green
        blue: { // Map all UI blue to terminal neon green
          50: "#001f00",
          100: "#002b00",
          200: "#004000",
          300: "#005a00",
          400: "#008000",
          500: "#00aa00",
          600: "#00ff00", // Primary action color
          700: "#33ff33",
          800: "#66ff66",
          900: "#99ff99",
        },
        gray: { // Invert grays for dark mode
          50: "#050a05",  // old light background
          100: "#0a140a", // slightly lighter
          200: "#142914",
          300: "#1f3d1f",
          400: "#336633",
          500: "#5c8a5c",
          600: "#85ad85", // text-gray-600
          700: "#b3d1b3",
          800: "#00ff00", // old dark text becomes neon green text
          900: "#ccffcc",
        },
      },
      fontFamily: {
        sans: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        lg: "0px", // Sharp corners for hacker theme
        md: "0px",
        sm: "0px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
