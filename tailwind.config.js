/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // scrollbar: {
      //   DEFAULT: {
      //     width: '6px',
      //     height: '6px',
      //     backgroundColor: '#f0f0f0',
      //   },
      //   track: {
      //     backgroundColor: '#e0e0e0',
      //   },
      //   thumb: {
      //     backgroundColor: '#888888',
      //     borderRadius: '10px',
      //   },
      //   hover: {
      //     thumb: {
      //       backgroundColor: '#555555',
      //     },
      //   },
      // },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
