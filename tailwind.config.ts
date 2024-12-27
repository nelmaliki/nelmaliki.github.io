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
        TiffanyBlue: "#99DDC8",
        Onyx:"#34383B", 
        DavyGrey: "#4B4E51",
        NaplesYellow: "#F2CD60",
        Asparagus: "#659B5E"
      },
    },
  },
  plugins: [],
} satisfies Config;
