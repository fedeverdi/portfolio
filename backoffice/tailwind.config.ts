import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        'background': '#f7f9fb',
        'surface': '#f7f9fb',
        'surface-bright': '#f7f9fb',
        'surface-dim': '#cfdce3',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f0f4f7',
        'surface-container': '#e8eff3',
        'surface-container-high': '#e1e9ee',
        'surface-container-highest': '#d9e4ea',
        'surface-variant': '#d9e4ea',
        'on-background': '#2a3439',
        'on-surface': '#2a3439',
        'on-surface-variant': '#566166',
        'primary': '#565e74',
        'primary-dim': '#4a5268',
        'primary-fixed': '#dae2fd',
        'primary-fixed-dim': '#ccd4ee',
        'primary-container': '#dae2fd',
        'on-primary': '#f7f7ff',
        'on-primary-container': '#4a5167',
        'on-primary-fixed': '#373f54',
        'secondary': '#526075',
        'secondary-dim': '#465469',
        'secondary-container': '#d5e3fd',
        'secondary-fixed': '#d5e3fd',
        'secondary-fixed-dim': '#c7d5ee',
        'on-secondary': '#f8f8ff',
        'on-secondary-container': '#455367',
        'on-secondary-fixed': '#324054',
        'tertiary': '#506076',
        'tertiary-dim': '#44546a',
        'tertiary-container': '#c8d8f3',
        'tertiary-fixed': '#c8d8f3',
        'tertiary-fixed-dim': '#bacae4',
        'on-tertiary': '#f7f9ff',
        'on-tertiary-container': '#3c4c61',
        'on-tertiary-fixed': '#29394e',
        'on-tertiary-fixed-variant': '#46556b',
        'outline': '#717c82',
        'outline-variant': '#a9b4b9',
        'error': '#9f403d',
        'error-dim': '#4e0309',
        'error-container': '#fe8983',
        'on-error': '#fff7f6',
        'on-error-container': '#752121',
        'inverse-primary': '#dae2fd',
        'inverse-surface': '#0b0f10',
        'inverse-on-surface': '#9a9d9f',
        'surface-tint': '#565e74'
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: [forms]
} satisfies Config
