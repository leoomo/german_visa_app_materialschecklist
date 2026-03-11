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
          DEFAULT: '#0071e3',
          hover: '#0077ed',
          light: '#f0f7ff',
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
        link: '#007aff',
      },
    },
  },
  plugins: [],
}
