import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#f3f0e8',
        muted: '#a9a39a',
        canvas: '#121214',
        surface: '#1a1a1e',
        panel: '#24242a',
        line: '#383842',
        amber: '#f59e0b',
        copper: '#c2410c',
        emerald: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        amber: '0 16px 45px rgba(245, 158, 11, .16)',
        panel: '0 24px 70px rgba(0, 0, 0, .28)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
