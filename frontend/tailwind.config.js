const colors = require('tailwindcss/colors');

const extensions = ['js', 'ts', 'hbs', 'html','gjs', 'gts'];

module.exports = {
  content: [
    `./app/**/*.{${extensions.join(',')}}`,
    `./tests/**/*.{${extensions.join(',')}}`,
    "./node_modules/flowbite/**/*.js"
  ],
  corePlugins: {},
  plugins: [
    require('flowbite/plugin')
  ],
  theme: {
    extends: {
      backgroundImage: {
        'home': "url('https://static1.srcdn.com/wordpress/wp-content/uploads/2022/03/Belle-in-Beauty-and-the-beast-1991-reading-a-book-to-sheep-animation.jpg')"
      },
      screens: {
        lxg: '1140px',
        '2xl': '1600px',
        '3xl': '1680px',
      },
    },
    colors: {
      primary: '#f0ebe9',
      secondary: '#2B4999',
      text: '#647377',
      background: '#1c1414',
      'background-disabled': '#F6F6F6',
      'text-secondary': '#384043',
      error: '#D72F33',
      warn: '#ffcc00',
      white: colors.white,
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      amber: colors.amber,
      teal: colors.teal,
      transparent: colors.transparent,
      red: colors.red,
      gray: colors.gray,
    },
  },
};
