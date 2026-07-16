/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#120a1f',
          panel: 'rgba(30, 15, 45, 0.85)',
        },
        gold: {
          DEFAULT: '#ffd700',
          glow: 'rgba(255, 215, 0, 0.6)',
        },
        purple: {
          DEFAULT: '#8a2be2',
          glow: 'rgba(138, 43, 226, 0.7)',
        }
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        ui: ['Metamorphous', 'cursive'],
        body: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
