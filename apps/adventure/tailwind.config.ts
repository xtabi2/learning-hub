import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#f3f7f4",
          100: "#e1ebe3",
          200: "#c3d7c8",
          300: "#9abb9f",
          400: "#6f9a77",
          500: "#4f7c58",
          600: "#3d6345",
          700: "#2f4d37",
          800: "#27402e",
          900: "#1d3023",
        },
        gold: {
          400: "#e4b84a",
          500: "#d4a017",
          600: "#b8860b",
        },
        cream: {
          DEFAULT: "#fbf6ee",
          deep: "#fdf5e6",
        },
        nibbles: {
          DEFAULT: "#a4d65e",
          ink: "#3f6b2a",
        },
        skytrim: {
          DEFAULT: "#3a82c4",
          bright: "#38bdf8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
