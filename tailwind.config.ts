import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        transparent: 'transparent',
        current: 'currentColor',
        //to not conflict with built in colors, custom ones use nourX prefix
        nourBlue: {
          DEFAULT: "#88CCF1"
        },
        nourGrey: {
          DEFAULT: "#4C5760"
        },
        nourRed: {
          DEFAULT: "#F97078"
        },
        nourYellow: {
          DEFAULT: "#F2CD60"
        },
        nourGreen: {
          DEFAULT: "#53A255"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
