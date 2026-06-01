/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#0a0a10',
        panel:   '#111118',
        card:    '#1c1c26',
        hover:   '#22222e',
        border:  '#2a2a3a',
        borderActive: '#4a4a6a',
        textPrimary: '#e8e8f2',
        textSecondary: '#9090b0',
        textMuted: '#5a5a7a',
        accent:  '#8b5cf6',
        accentLight: '#a78bfa',
        accentDark: '#7c3aed',
        danger:  '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        canvas: '0 25px 80px rgba(0,0,0,0.8)',
        panel: '2px 0 8px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}

