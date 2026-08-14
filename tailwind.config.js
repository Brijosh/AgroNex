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
        crop: {
          50: '#F2F8F5',
          100: '#E2F1E8',
          200: '#C3E2D1',
          300: '#96CCB0',
          400: '#63B18B',
          500: '#3D966E',
          600: '#2D7A58',
          700: '#1B5B3E',
          800: '#164E35',
          900: '#0F3C28',
          950: '#082317',
        },
        forest: {
          50: '#F4F7F5',
          100: '#E5EDE7',
          600: '#235D3A',
          700: '#1B4D2E',
          800: '#143C23',
          900: '#0D2B18',
          950: '#071A0E',
        },
        surface: {
          canvas: '#FAFAF8',
          card: '#FFFFFF',
          muted: '#F4F4F2',
          subtle: '#ECECE9',
          border: '#E5E5E2',
        },
        pastel: {
          green: '#EDF6EE',
          greenText: '#235D3A',
          amber: '#FEF6E9',
          amberText: '#8D5B00',
          sky: '#EBF5FB',
          skyText: '#186499',
          rose: '#FDF0F0',
          roseText: '#A32828',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'ambient': '0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 4px 12px 0 rgba(0, 0, 0, 0.03)',
        'elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 20px -2px rgba(27, 91, 62, 0.15)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
};

