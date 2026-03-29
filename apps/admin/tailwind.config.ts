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
          bg: '#0f172a',
          surface: '#1e293b',
          'surface-raised': '#334155',
          border: '#475569',
          accent: '#6366f1',
          'accent-light': '#818cf8',
          text: '#f8fafc',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
