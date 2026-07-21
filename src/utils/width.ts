export const getSizing = (size: "small" | "normal") => {
  return {
    widthClasses: {
      small: "w-44",
      normal: "w-64",
    }[size],
    heightClasses: {
      small: "h-44",
      normal: "h-64",
    }[size],
  }
}
