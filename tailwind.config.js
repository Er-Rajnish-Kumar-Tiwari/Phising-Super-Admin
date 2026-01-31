/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

delete colors?.lightBlue;
delete colors?.warmGray;
delete colors?.trueGray;
delete colors?.coolGray;
delete colors?.blueGray;

module.exports = {
  important: true,
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,css,,md,mdx,ts,tsx}",
    "./components/**/*.{js,jsx,md,mdx,ts,tsx}",
    "./app/**/*.{js,jsx,css,md,mdx,ts,tsx}",
    "./src/**/*.{js,jsx,md,mdx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem'
  		},
  		screens: {
  			xs: '100%',
  			sm: '540px',
  			md: '720px',
  			lg: '960px',
  			xl: '1140px',
  			'2xl': '1320px'
  		}
  	},
  	extend: {
  		colors: {
  			brand: {
  				DEFAULT: '#2962FF'
  			},
  			graniteGray: '#696767',
  			scarlet: '#ff280017',
  			crimson: '#E50F0F',
  			caramel: '#FFD88D',
  			palePink: '#F8D7DA',
  			bloodOrange: '#D70014',
  			lightGray: '#D6CFCF',
  			cultured: '#F6F6F6',
  			islamicGreen: '#029A11',
  			magicMint: '#B6FFBD',
  			mistyRose: '#FDE3DE',
  			doctorPale: '#F9F9F9',
  			broadGray: '#EBEAEA',
  			brandColor: '#FFF2F0',
  			successBackground: '#B6FFBD',
  			successText: '#029A11',
  			skeletonColor: '#00000013',
                ...colors,
  			border: 'hsl(var(--border))',
  			default: {
  				'50': 'hsl(var(--default-50) / <alpha-value>)',
  				'100': 'hsl(var(--default-100) / <alpha-value>)',
  				'200': 'hsl(var(--default-200) / <alpha-value>)',
  				'300': 'hsl(var(--default-300) / <alpha-value>)',
  				'400': 'hsl(var(--default-400) / <alpha-value>)',
  				'500': 'hsl(var(--default-500) / <alpha-value>)',
  				'600': 'hsl(var(--default-600) / <alpha-value>)',
  				'700': 'hsl(var(--default-700) / <alpha-value>)',
  				'800': 'hsl(var(--default-800) / <alpha-value>)',
  				'900': 'hsl(var(--default-900) / <alpha-value>)',
  				'950': 'hsl(var(--default-950) / <alpha-value>)'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': 'hsl(var(--primary-50) / <alpha-value>)',
  				'100': 'hsl(var(--primary-100) / <alpha-value>)',
  				'200': 'hsl(var(--primary-200) / <alpha-value>)',
  				'300': 'hsl(var(--primary-300) / <alpha-value>)',
  				'400': 'hsl(var(--primary-400) / <alpha-value>)',
  				'500': 'hsl(var(--primary-500) / <alpha-value>)',
  				'600': 'hsl(var(--primary-600) / <alpha-value>)',
  				'700': 'hsl(var(--primary-700) / <alpha-value>)',
  				'800': 'hsl(var(--primary-800) / <alpha-value>)',
  				'900': 'hsl(var(--primary-900) / <alpha-value>)',
  				'950': 'hsl(var(--primary-950) / <alpha-value>)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				'700': '#be185d',
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				'700': '#15803d',
  				DEFAULT: 'hsl(var(--success) / <alpha-value>)',
  				foreground: 'hsl(var(--success-foreground) / <alpha-value>)'
  			},
  			info: {
  				'700': '#0f766e',
  				DEFAULT: 'hsl(var(--info) / <alpha-value>)',
  				foreground: 'hsl(var(--info-foreground) / <alpha-value>)'
  			},
  			warning: {
  				'700': '#a16207',
  				DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
  				foreground: 'hsl(var(--warning-foreground) / <alpha-value>)'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			sm: '0px 1px 2px 0px rgba(15, 22, 36, 0.06), 0px 1px 3px 0px rgba(15, 22, 36, 0.10)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			slideDownAndFade: {
  				from: {
  					opacity: 0,
  					transform: 'translateY(-2px)'
  				},
  				to: {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			slideLeftAndFade: {
  				from: {
  					opacity: 0,
  					transform: 'translateX(2px)'
  				},
  				to: {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			},
  			slideUpAndFade: {
  				from: {
  					opacity: 0,
  					transform: 'translateY(2px)'
  				},
  				to: {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			slideRightAndFade: {
  				from: {
  					opacity: 0,
  					transform: 'translateX(-2px)'
  				},
  				to: {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
