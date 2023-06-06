/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
				sans: ['\'Poppins\', sans-serif'],
				serif: ['\'Volkhov\', serif'],
			},
      colors: {
        primary: '#16ABF8',
        secondary: '#888888',
        danger: '#ED4C5C',
        warning: '#F8A541',
        success: '#00A790',
        dodger: '#428BC1',
        purple: '#8942C1',
      },
    },
  },
  plugins: [],
}
