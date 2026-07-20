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
          primary: "#FFF9F2",
          card: "#FFFFFF",
        },
        text: {
          primary: "#10243E",
          secondary: "#667085",
        },
        accent: {
          DEFAULT: "#F47B68",
          light: "#FFF0EB",
        },
        border: "#DED7CE",
        ink: "#10243E",
        coral: "#F47B68",
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
