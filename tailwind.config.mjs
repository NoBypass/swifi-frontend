const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')
const svgToDataUri = require('mini-svg-data-uri')

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontFamily: {
			sans: ["SF\\ Pro", "sans-serif"],
		},
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
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
			borderWidth: {
				'3': '3px',
			},
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				}
			},
		}
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
};

export default config;
