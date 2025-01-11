/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./../frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Fira Sans', 'sans-serif'],
        // 'serif': ['serif'],
        'mono': ['Fira Mono', 'mono'],
      }
    }
  }
}

