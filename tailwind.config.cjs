module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateRows: {
        layout: '93% 7%'
      },
      colors: {
        matte: {
          light: '#1a1a1a',
          DEFAULT: '#0a0a0a',
          dark: '#000000'
        },
        'matte-orange': {
          light: '#e09785',
          DEFAULT: '#c97d7d',
          dark: '#a96365'
        },
        'matte-light': {
          light: '#2c2c2c',
          DEFAULT: '#1c1c1c',
          dark: '#0c0c0c'
        },
        'matte-medium': {
          light: '#202020',
          DEFAULT: '#101010',
          dark: '#000000'
        },
        'matte-green': {
          light: '#139139',
          DEFAULT: '#117117',
          dark: '#0f5f5f'
        }
      },
      backgroundImage: (theme) => ({
        matte: `linear-gradient(145deg, ${theme('colors.matte.light')} 0%, ${theme(
          'colors.matte.dark'
        )} 100%)`,
        'matte-orange': `linear-gradient(145deg, ${theme('colors.matte-orange.light')} 0%, ${theme(
          'colors.matte-orange.dark'
        )} 100%)`,
        'matte-light': `linear-gradient(145deg, ${theme('colors.matte-light.light')} 0%, ${theme(
          'colors.matte-light.dark'
        )} 100%)`,
        'matte-medium': `linear-gradient(145deg, ${theme('colors.matte-medium.light')} 0%, ${theme(
          'colors.matte-medium.dark'
        )} 100%)`,
        'matte-green': `linear-gradient(145deg, ${theme('colors.matte-green.light')} 0%, ${theme(
          'colors.matte-green.dark'
        )} 100%)`
      })
    }
  },
  plugins: []
};
