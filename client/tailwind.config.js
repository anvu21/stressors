/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {

        l_brn: '#edcaa6',
        cya: '#55c8b4',
        yel: '#ffde5a',
        oran: '#fd9556',
        brn: '#e8ae72',
        purp: '#4a3e62',
        
        primary: "#ffffff",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        main: "#eff6ff",
        green: "",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};