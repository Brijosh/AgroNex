/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          canvas: '#F5F5F7',
          card: '#FFFFFF',
          dark: '#1D1D1F',
          subtle: '#86868B',
          border: 'rgba(0, 0, 0, 0.08)',
          emerald: '#059669',
          emeraldDark: '#047857',
        },
        crop: {
          50: '#F2F9F5',
          100: '#E1F3E8',
          200: '#C2E7D1',
          300: '#95D4B1',
          400: '#5EBB8A',
          500: '#34A06B',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
      },
      fontFamily: {
        sans: ['"Cabinet Grotesk"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple-md': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
