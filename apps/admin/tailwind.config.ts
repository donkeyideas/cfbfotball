import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f4efe4',
          surface: '#faf7f0',
          'surface-raised': '#ece7db',
          border: '#d4c9b5',
          accent: '#8b1a1a',
          'accent-light': '#6b1111',
          text: '#3b2f1e',
          'text-secondary': '#6b5d4d',
          'text-muted': '#9a8c7a',
          success: '#4a7c59',
          warning: '#b8860b',
          error: '#8b1a1a',
          info: '#4a6c8c',
          gold: '#c9a84c',
          tan: '#d4c5a0',
        },
      },
      fontFamily: {
        sans: ['var(--admin-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--admin-serif)', 'Georgia', 'serif'],
        mono: ['var(--admin-mono)', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
