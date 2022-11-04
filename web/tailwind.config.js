/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Roboto, sans-serif',
      },

      backgroundImage: {
        app: 'url(/background.png)',
      },

      keyframes: {
        floating: {
          '0%': {
            transform: 'translatey(0px)',
          },
          '50%': {
            transform: 'translatey(-15px)',
          },
          '100%': {
            transform: 'translatey(0px)',
          },
        },
      },

      animation: {
        floating: 'floating 5s ease-in-out infinite',
      },

      colors: {
        gray: {
          100: '#E1E1E6',
          300: '#8D8D99',
          600: '#323238',
          800: '#202024',
          900: '#121214',
        },

        ignite: {
          500: '#129E57',
        },

        yellow: {
          500: '#F7DD43',
          700: '#E5CD3D',
        },
      },
    },
  },
  plugins: [],
};
