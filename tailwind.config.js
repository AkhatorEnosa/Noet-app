import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
     daisyui,
  ],
  daisyui: {
    themes: ["cupcake"],
  },
     safelist: [
{
  pattern:
    /(bg|text|border)-(purple|pink|orange|yellow|green|black|gray|neutral|red|blue|white)/,
  },
],
}