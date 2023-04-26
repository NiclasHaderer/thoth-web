const sizes = require("./tailwind.sizes")
const colors = {
  variable(variable) {
    return ({ opacityValue }) => {
      if (opacityValue === undefined) {
        return `rgb(var(${variable}))`
      }
      return `rgb(var(${variable}) / ${opacityValue})`
    }
  },
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
  plugins: [require("@tailwindcss/typography"), require("./tailwind.touch")],
}
