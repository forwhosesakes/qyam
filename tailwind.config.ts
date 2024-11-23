import type { Config } from "tailwindcss";
import clipPath from 'tailwind-clip-path';

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      clipPath: {
        'angled-clip': 'polygon(0 0, 0 calc(100% - 20%), 100% 100%, 100% 0)',
      },
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
  plugins: [clipPath],
} satisfies Config;
