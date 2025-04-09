/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        offwhite: "var(--offwhite)",
        baseblack: "var(--baseblack)",
        basegray: "var(--basegray)",
      },
    },

    fontFamily: {
      castoro: ["Castoro", "sans-serif"],
    },

    screens: {
      xxs: "320px",
      xss: "400px",
      xs: "576px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
      "2xl": "1440px",
      "3xl": "1536px",
      "4xl": "1740px",
      "5xl": "1920px",
      "6xl": "2200px",
    },
    container: {
      center: true,
      margin: "0 auto",
      padding: "1rem",
      screens: {
        xxs: "310px",
        xss: "380px",
        xs: "546px",
        sm: "620px",
        md: "718px",
        lg: "992px",
        xl: "1180px",
        "2xl": "1420px",
        "3xl": "1516px",
        "4xl": "1700px",
      },
    },
  },

  plugins: [],
};
