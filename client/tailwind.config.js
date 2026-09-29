/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#f7f5fa',
        surface: {
          DEFAULT: '#ffffff',
          soft: '#fbf9fe',
          alt: '#faf9fc',
        },
        plum: {
          brand: '#240b49',
          primary: '#2b0f4c',
          dark: '#1e0a3c',
          bright: '#591d8f',
          300: '#6c28a8',
          400: '#4d1e8d',
          500: '#3d156b',
        },
        orange: {
          primary: '#ea580c',
          hover: '#c2410c',
          highlight: '#f97316',
          light: '#fb923c',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
        },
        status: {
          success: '#059669',
          warning: '#d97706',
          info: '#2563eb',
          error: '#dc2626',
        },
        border: {
          DEFAULT: '#e9e1f5',
          alt: '#e5dcf2',
        },
        text: {
          primary: '#0f172a',
          secondary: '#4b5563',
        },
        // Backward compatibility
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        tricolor: {
          saffron: '#ea580c',
          green: '#15803d',
          navy: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(36, 11, 73, 0.04), 0 1px 2px -1px rgba(36, 11, 73, 0.04)',
        'card-medium': '0 4px 6px -1px rgba(36, 11, 73, 0.06), 0 2px 4px -2px rgba(36, 11, 73, 0.04)',
        'card-focused': '0 10px 15px -3px rgba(36, 11, 73, 0.08), 0 4px 6px -4px rgba(36, 11, 73, 0.04)',
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
        'card-sm': '12px',
      }
    },
  },
  plugins: [],
}
