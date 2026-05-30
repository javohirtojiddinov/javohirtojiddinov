import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        jeya: {
          dark: '#04070d',
          card: '#0a121e',
          border: '#13314a',
          cyan: '#00e5ff',
          'cyan-dim': '#00b8cc',
          emerald: '#00ff9d',
          'emerald-dim': '#00cc7a',
          accent: '#6366f1',
          'accent-glow': '#818cf8',
          text: '#dff3ff',
          muted: '#5f87a6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 18s linear infinite',
        'spin-rev': 'spin-rev 24s linear infinite',
        'spin-med': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px #00e5ff55' },
          '100%': { boxShadow: '0 0 50px #00ff9d66, 0 0 90px #00e5ff44' },
        },
        'spin-rev': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      }
    },
  },
  plugins: [],
}
export default config
