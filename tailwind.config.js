/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#001F3F',
          light: '#003366',
          dark: '#00152A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4D03F',
          dark: '#B38728',
        },
        techBlue: '#0070F3',
        charcoal: '#333333',
        offWhite: '#F8F5F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(0, 31, 63, 0.95) 0%, rgba(0, 31, 63, 0.8) 100%)',
      },
      boxShadow: {
        'gold': '0 4px 15px rgba(212, 175, 55, 0.3)',
        'gold-hover': '0 6px 20px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
