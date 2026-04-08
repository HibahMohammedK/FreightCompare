
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          dark: '#0D4073',
          darker: '#0A3459',
          darkest: '#051C2E',
          light: '#EBF2F8',
          lighter: '#D1E3F0',
        },
        surface: '#FFFFFF',
        bg: {
          light: '#F9FAFB',
          dark: '#F7F8FA',
        },
        text: {
          dark: '#111827',
          darker: '#1A1D23',
          medium: '#374151',
          'medium-light': '#4B5563',
          light: '#6B7280',
          lighter: '#9CA3AF',
        },
        border: {
          light: '#E5E7EB',
          medium: '#D2DEFF',
          dark: '#D1D5DB',
        },
        sea: {
          bg: '#E6F5F5',
          text: '#0B6362',
          border: '#0E7C7B',
        },
        air: {
          bg: '#EEEDF9',
          text: '#4940A6',
          border: '#5B4FCF',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
          bg: '#F0FDF4',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          bg: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
