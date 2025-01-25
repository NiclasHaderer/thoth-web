const sizes = require("./tailwind.sizes")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "index.html",
  ],
  theme: {
    colors: {
      // Primary colors
      primary: "var(--primary)",
      // Surface colors
      surface: "var(--surface)",
      // Font styles
      font: "var(--font-color)",
      "font-secondary": "var(--font-color-secondary)",
      // Make some element active by applying a transparent color
      active: "var(--active)",
      "active-light": "var(--active-light)",
      // Elevation
      elevate: "var(--elevate-1)",
      "elevate-2": "var(--elevate-2)",
      // Basic colors
      transparent: "transparent",
      inherit: "inherit",
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
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("./tailwind.touch")],
}
