import daisyui from "daisyui"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#202124',
          surface: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
          textMuted: '#94a3b8',
        }
      }
    },
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