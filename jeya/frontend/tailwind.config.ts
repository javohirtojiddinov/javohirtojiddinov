import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        jeya: {
          dark: '#020408',
          card: '#080f18',
          border: '#0d2035',
          cyan: '#00f5ff',
          'cyan-dim': '#00c4cc',
          emerald: '#00ff87',
          'emerald-dim': '#00cc6a',
          accent: '#6366f1',
          text: '#e2f4ff',
          muted: '#4a7a9b',
        }
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 6s linear infinite',
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'glow-cyan': 'glow-cyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-reverse': { from: { transform: 'rotate(360deg)' }, to: { transform: 'rotate(0deg)' } },
        'pulse-cyan': {
          '0%,100%': { boxShadow: '0 0 20px #00f5ff44, 0 0 40px #00f5ff22' },
          '50%': { boxShadow: '0 0 40px #00f5ff88, 0 0 80px #00f5ff44, 0 0 120px #00f5ff22' },
        },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        'glow-cyan': {
          '0%': { textShadow: '0 0 10px #00f5ff' },
          '100%': { textShadow: '0 0 20px #00f5ff, 0 0 40px #00f5ff88' },
        },
      }
    },
  },
  plugins: [],
}
export default config
