/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Putting screens here overrides the defaults entirely
    screens: {
      'xs': '480px',   // Mobile (Large)
      'sm': '640px',   // Tablets (Small)
      'md': '768px',   // Tablets (Portrait)
      'lg': '1024px',  // Laptops/Tablets (Landscape)
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large Desktop (Optional, but standard)
    },
  },
  plugins: [],
}