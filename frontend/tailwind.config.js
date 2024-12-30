/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Nunito', 'sans-serif'],
      'serif': ["PT Serif", 'serif'],
      'mono': ['Fira Mono', 'mono'],
    }
  }
}

