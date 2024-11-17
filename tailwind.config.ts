import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0D3151',
        secondary: '#8BC53F',
        tertiary: '#D9D9D9'},
        fontFamily: {
          primary: "Saudia-sans",
        },
    },
  },
  plugins: [],
} satisfies Config;
