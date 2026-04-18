/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Drilleedo Primary Colors
        primary: {
          50: '#E6F1FB',
          100: '#B5D4F4',
          200: '#85B7EB',
          300: '#5A9AE0',
          400: '#378ADD',
          500: '#185FA5',
          600: '#0F4A7D',
          700: '#0A3660',
          800: '#05223D',
          900: '#020D1A',
        },
        // Drilleedo Teal (Trust, Growth)
        teal: {
          50: '#E1F5EE',
          100: '#9FE1CB',
          200: '#5DCAA5',
          300: '#3DB887',
          400: '#1D9E75',
          500: '#0F6E56',
          600: '#085041',
          700: '#043830',
          800: '#022620',
          900: '#001410',
        },
        // Drilleedo Coral (Energy, CTA)
        coral: {
          50: '#FAECE7',
          100: '#F5C4B3',
          200: '#F0997B',
          300: '#E87F54',
          400: '#D85A30',
          500: '#B84820',
          600: '#984018',
          700: '#783811',
          800: '#58280A',
          900: '#381804',
        },
        // Drilleedo Purple (Subtle, Hierarchy)
        purple: {
          50: '#EEEDFE',
          100: '#D4CFF8',
          200: '#B9B0EF',
          300: '#9E91E6',
          400: '#8372DD',
          500: '#6853D4',
          600: '#4D39B8',
          700: '#3C3489',
          800: '#26215C',
          900: '#160D2F',
        },
        // Grays (Text, Background, Borders)
        gray: {
          50: '#F1EFE8',
          100: '#E4E2D9',
          200: '#D3D1C7',
          300: '#C2BFB6',
          400: '#B1AFA5',
          500: '#A09E94',
          600: '#888780',
          700: '#6F6D64',
          800: '#5F5E5A',
          900: '#444441',
          950: '#2C2C2A',
        },
      },

      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Garamond', 'serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },

      fontSize: {
        // Typography Scale
        xs: ['12px', { lineHeight: '1.5', letterSpacing: '0' }],
        sm: ['14px', { lineHeight: '1.5', letterSpacing: '0' }],
        base: ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
        lg: ['18px', { lineHeight: '1.6', letterSpacing: '0' }],
        xl: ['20px', { lineHeight: '1.6', letterSpacing: '0' }],
        '2xl': ['24px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        '4xl': ['36px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '5xl': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },

      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      spacing: {
        // 8px Grid System
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },

      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        // Subtle Shadows (Drilleedo Style)
        none: 'none',
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.12)',
        md: '0 4px 16px rgba(0, 0, 0, 0.12)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
        xl: '0 8px 32px rgba(0, 0, 0, 0.16)',
        '2xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },

      transitionDuration: {
        DEFAULT: '300ms',
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },

      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        material: 'cubic-bezier(0.4, 0, 0.2, 1)',
        ease: 'ease',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },

      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },

      maxWidth: {
        container: '1200px',
        prose: '65ch',
      },

      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },

      backdropOpacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        25: '0.25',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        75: '0.75',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
      },
    },
  },
  plugins: [
    // Custom plugin for glass morphism effect
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          '@apply': 'bg-white/30 backdrop-blur-md border border-white/20',
        },
        '.card': {
          '@apply': 'bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300',
        },
        '.btn-primary': {
          '@apply': 'px-8 py-3 bg-coral-400 text-white font-semibold rounded-md hover:bg-coral-500 transition-colors duration-300',
        },
        '.btn-secondary': {
          '@apply': 'px-8 py-3 bg-transparent border-2 border-primary-500 text-primary-500 font-semibold rounded-md hover:bg-primary-500 hover:text-white transition-colors duration-300',
        },
        '.btn-tertiary': {
          '@apply': 'px-4 py-2 bg-transparent text-teal-500 font-medium rounded hover:bg-teal-50 transition-colors duration-300',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
