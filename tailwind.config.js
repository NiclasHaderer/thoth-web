const sizes = require("./sizes")
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      screens: {
        "3xl": "1700px",
        "4xl": "1900px",
      },
      colors: {
        primary: "#a13c2a",
        unimportant: "#FFFFFF72",
        background: "#29323e",
        font: "#eee",
        "light-active": "rgba(255, 255, 255, .1)",
        active: "rgba(255, 255, 255, .2)",
        elevate: "rgba(0, 0, 0, .15)",
      },
      minWidth: sizes,
      maxWidth: sizes,
      minHeight: sizes,
      maxHeight: sizes,
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), require("./touch-variants")],
}
