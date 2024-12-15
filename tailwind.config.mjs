import tailwindcssAnimate from 'tailwindcss-animate';
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');
const svgToDataUri = require('mini-svg-data-uri');

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['SF\\ Pro', 'sans-serif'],
      mono: ['SF\\ Mono', 'monospace'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      animation: {
        blink: 'blink 1s linear infinite',
        'loader-linear-spin': 'loader-spin .8s linear infinite',
        'loader-ease-spin': 'loader-spin .8s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--bits-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--bits-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'loader-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(1turn)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-dots': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="${value}"><circle cx="2" cy="2" r="1"/></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    },
    function ({ addUtilities }) {
      addUtilities({
        '.text-outline': {
          textShadow:
            '1px 1px 0 #9ca3af, -1px -1px 0 #9ca3af, 1px -1px 0 #9ca3af, -1px 1px 0 #9ca3af',
        },
      });
    },
  ],
};

export default config;
