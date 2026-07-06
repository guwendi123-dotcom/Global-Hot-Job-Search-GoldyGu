import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#F7F6F3",
          card: "#FFFFFF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
        },
        accent: {
          DEFAULT: "#FF6B35",
          light: "#FFF0EB",
        },
        border: "#E5E7EB",
      },
      fontFamily: {
        display: ['var(--font-clash)', "system-ui", "sans-serif"],
        body: ['var(--font-satoshi)', "system-ui", "sans-serif"],
        handwriting: ['"ZCOOL XiaoWei"', "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
