import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        crimson: 'var(--crimson)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        dark: 'var(--dark)',
        'school-primary': 'var(--school-primary)',
        'school-secondary': 'var(--school-secondary)',
        'school-dark': 'var(--school-dark)',
      },
      fontFamily: {
        serif: ['var(--serif)'],
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-grain.png')",
      },
    },
  },
  plugins: [],
};

export default config;
