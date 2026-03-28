import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        'surface-dim': '#161311',
        'on-surface': '#e9e1dd',
        'surface-container-lowest': '#100e0c',
        'on-error': '#690005',
        'surface-bright': '#3c3836',
        'secondary': '#cec5bf',
        'error-container': '#93000a',
        'on-tertiary': '#412c10',
        'primary-fixed-dim': '#b9c8de',
        'background': '#161311',
        'on-primary': '#233143',
        'outline': '#8e9197',
        'surface-variant': '#383432',
        'surface-container': '#221f1d',
        'on-tertiary-fixed': '#2a1801',
        'inverse-primary': '#516072',
        'on-secondary-fixed-variant': '#4b4641',
        'secondary-fixed': '#eae1da',
        'error': '#ffb4ab',
        'on-background': '#e9e1dd',
        'on-surface-variant': '#c4c6cd',
        'tertiary-fixed': '#ffddb6',
        'on-error-container': '#ffdad6',
        'on-primary-container': '#f9f9ff',
        'secondary-container': '#4b4641',
        'on-secondary-container': '#bcb3ae',
        'surface': '#161311',
        'tertiary-container': '#8a6e4c',
        'tertiary-fixed-dim': '#e3c199',
        'secondary-fixed-dim': '#cec5bf',
        'surface-container-high': '#2d2927',
        'inverse-on-surface': '#33302d',
        'on-tertiary-container': '#fff9f5',
        'primary-container': '#657488',
        'on-primary-fixed': '#0d1c2d',
        'on-tertiary-fixed-variant': '#5a4224',
        'surface-container-low': '#1e1b19',
        'on-secondary': '#342f2b',
        'tertiary': '#e3c199',
        'primary-fixed': '#d4e4fa',
        'surface-container-highest': '#383432',
        'on-secondary-fixed': '#1f1b17',
        'primary': '#b9c8de',
        'surface-tint': '#b9c8de',
        'inverse-surface': '#e9e1dd',
        'on-primary-fixed-variant': '#39485a',
        'outline-variant': '#44474c'
      },
      fontFamily: {
        'headline': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        full: '9999px'
      }
    }
  },
  plugins: []
} satisfies Config
