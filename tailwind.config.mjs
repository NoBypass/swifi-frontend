const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')
const svgToDataUri = require('mini-svg-data-uri')

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			'sf-pro-display': ['"SF Pro Display"', 'sans-serif'],
		},
		extend: {
			keyframes: {
				'loader-spin': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(1turn)' },
				},
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' },
				},
			},
			animation: {
				blink: 'blink 1s linear infinite',
				'loader-linear-spin': 'loader-spin .8s linear infinite',
				'loader-ease-spin': 'loader-spin .8s ease infinite',
			},
		},
	},
	plugins: [
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
					textShadow: '1px 1px 0 #9ca3af, -1px -1px 0 #9ca3af, 1px -1px 0 #9ca3af, -1px 1px 0 #9ca3af',
				},
			})
		},
	],
}
