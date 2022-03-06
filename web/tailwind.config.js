const sizes = require("./tailwind.sizes")
const colors = require("./tailwind.color")
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    colors: {
      primary: colors.variable("--primary"),
      unimportant: colors.variable("--unimportant"),
      surface: colors.variable("--surface"),
      font: colors.variable("--text-color"),
      active: "var(--active)",
      "active-light": "var(--active-light)",
      elevate: "var(--elevate)",
      transparent: "transparent",
    },
    extend: {
      screens: {
        "3xl": "1700px",
        "4xl": "1900px",
      },
      minWidth: sizes,
      maxWidth: sizes,
      minHeight: sizes,
      maxHeight: sizes,
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp"), require("./tailwind.touch")],
}
