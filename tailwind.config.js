import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'xs': '480px',   // Mobile (Large)
      'sm': '640px',   // Tablets (Small)
      'md': '768px',   // Tablets (Portrait)
      'lg': '1024px',  // Laptops/Tablets (Landscape)
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large Desktop (Optional, but standard)
    },
  },
  plugins: [
     daisyui,
  ],
  daisyui: {
    themes: ["cupcake"],
  },
  safelist: [
    {
      pattern: /(bg|text|border)-(purple|pink|orange|yellow|green|black|gray|neutral|red|blue|white|rose|emerald|sky|teal|amber|indigo)/,
    },
    'border-white',
    'border-black'
  ],
}