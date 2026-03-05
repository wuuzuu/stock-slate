// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#03030A',
          900: '#06060A',
          800: '#0A0A10',
          700: '#0E0E18',
          600: '#16162A',
          500: '#252540',
          400: '#404060',
        },
        accent: {
          DEFAULT: '#FF0076',
          bright: '#FF4DA6',
          hover: '#CC005E',
          pink: '#FF4DA6',
          'pink-bright': '#FF80C1',
          glow: 'rgba(255, 0, 118, 0.4)',
          'pink-glow': 'rgba(255, 77, 166, 0.3)',
        },
        stock: {
          up: '#39FF14',
          'up-bright': '#80FF47',
          'up-glow': 'rgba(57, 255, 20, 0.3)',
          down: '#FF3157',
          'down-bright': '#FF6B8A',
          'down-glow': 'rgba(255, 49, 87, 0.3)',
          neutral: '#8888A0',
        },
        warning: {
          DEFAULT: '#FFAA00',
          glow: 'rgba(255, 170, 0, 0.25)',
        },
      },

      fontFamily: {
        sans: ['"Share Tech Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      // 사이버펑크: 거의 직각 모서리
      borderRadius: {
        none: '0',
        sm: '1px',
        DEFAULT: '2px',
        md: '2px',
        lg: '2px',
        xl: '3px',
        '2xl': '3px',
        '3xl': '4px',
        full: '9999px',
      },

      boxShadow: {
        'glow-accent': '0 0 20px rgba(255, 0, 118, 0.25), 0 0 40px rgba(255, 0, 118, 0.1)',
        'glow-up': '0 0 20px rgba(57, 255, 20, 0.25)',
        'glow-down': '0 0 20px rgba(255, 49, 87, 0.25)',
        'glow-sm': '0 0 10px rgba(255, 0, 118, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 0, 118, 0.06)',
        'dropdown': '0 8px 32px rgba(0, 0, 0, 0.8)',
      },

      backgroundImage: {
        'up-gradient': 'linear-gradient(135deg, rgba(57,255,20,0.1) 0%, rgba(57,255,20,0.03) 100%)',
        'down-gradient': 'linear-gradient(135deg, rgba(255,49,87,0.1) 0%, rgba(255,49,87,0.03) 100%)',
        'accent-gradient': 'linear-gradient(135deg, rgba(255,0,118,0.1) 0%, rgba(255,0,118,0.03) 100%)',
      },

      keyframes: {
        'price-flash-up': {
          '0%': { backgroundColor: 'rgba(57, 255, 20, 0.25)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'price-flash-down': {
          '0%': { backgroundColor: 'rgba(255, 49, 87, 0.25)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'live-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
        },
        'cyber-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 99%': { opacity: '0' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },

      animation: {
        'price-flash-up': 'price-flash-up 0.8s ease-out',
        'price-flash-down': 'price-flash-down 0.8s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.2s ease-out',
        'live-dot': 'live-dot 1.5s ease-in-out infinite',
        'cyber-blink': 'cyber-blink 1s step-end infinite',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config
