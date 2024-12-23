/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        rotate45: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(45deg)' },
        },
        rotateNeg45: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-45deg)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        rotate45: 'rotate45 0.35s cubic-bezier(.5,-0.35,.35,1.5)',
        rotateNeg45: 'rotateNeg45 0.35s cubic-bezier(.5,-0.35,.35,1.5)',
        fadeOut: 'fadeOut 0.35s ease-in-out',
      },
    },
  },
  plugins: [],
}
