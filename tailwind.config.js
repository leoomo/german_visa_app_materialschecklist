/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'sans-serif'],
      },
      colors: {
        // 主色调
        primary: {
          DEFAULT: '#1d1d1f',
          light: '#3d3d3f',
        },
        secondary: {
          DEFAULT: '#86868b',
          light: '#a1a1a6',
        },
        accent: {
          DEFAULT: '#0056b3',
          hover: '#0066c3',
          light: '#e6f0fa',
        },
        // 语义色
        success: '#34c759',
        successLight: '#e8f5e9',
        warning: '#ff9500',
        warningLight: '#fff7e6',
        // 背景色
        page: '#f5f5f7',
        card: '#ffffff',
        border: '#e8e8ed',
        borderLight: '#d1d1d6',
        // 链接色
        link: '#0056b3',
        // 提示文字色
        notice: '#8c7000',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.06)',
        cardHover: '0 2px 4px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
