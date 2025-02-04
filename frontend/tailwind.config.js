/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Sans", ...defaultTheme.fontFamily.sans],
        serif: [...defaultTheme.fontFamily.serif],
        mono: [...defaultTheme.fontFamily.mono],
      },
    },
  },
};
