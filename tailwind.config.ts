import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 100s linear infinite',
      },
      colors: {
        primary: '#0D3151',
        secondary: '#8BC53F',
        tertiary: '#659CCD'},
        fontFamily: {
          primary: "Saudia-sans",
        },
    },
  },
  plugins: [],
} satisfies Config;
