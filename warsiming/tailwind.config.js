/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkMetal: '#1a1a1a',
        glowGreen: '#00ff00',
        bloodRed: '#d43f3f',
        gray: {
          900: '#121212',
          800: '#1e1e1e',
          700: '#2a2a2a',
          600: '#3a3a3a',
          400: '#9a9a9a',
          300: '#c3c3c3',
        },
      },
      fontFamily: {
        gothic: ['Cinzel', 'serif'],
        futuristic: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 255, 0, 0.8)',
      },
    },    
  },
  plugins: [],
};

