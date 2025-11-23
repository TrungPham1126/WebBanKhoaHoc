/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        udemy: {
          DEFAULT: "#A435F0", // Màu tím Udemy
          dark: "#2D2F31", // Màu đen text
          gray: "#F7F9FA", // Màu nền xám
          light: "#D1D7DC", // Màu viền
          yellow: "#E59819", // Màu sao đánh giá
        },
      },
      fontFamily: {
        sans: ['"Udemy Sans"', "sans-serif"], // Hoặc dùng font mặc định
      },
    },
  },
  plugins: [],
};
