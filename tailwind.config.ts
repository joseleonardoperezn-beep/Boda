import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: {
            light: '#EAF2F8',
            DEFAULT: '#A4C3D2',
            dark: '#6A92A6',
          },
          yellow: {
            light: '#FEF9E7',
            DEFAULT: '#F9E79F',
            dark: '#C9A314',
          },
          cream: {
            light: '#FDFBF7',
            DEFAULT: '#F7F3E9',
            dark: '#EBE3CE',
          },
          charcoal: '#2D3748',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        oil: '0 10px 30px -10px rgba(164, 195, 210, 0.35), 0 20px 25px -5px rgba(247, 243, 233, 0.5)',
        'oil-subtle': '0 4px 20px -2px rgba(106, 146, 166, 0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

