export const getSizing = (size: "small" | "normal") => {
  return {
    widthClasses: {
      small: "w-32",
      normal: "w-52",
    }[size],
    heightClasses: {
      small: "h-32",
      normal: "h-52",
    }[size],
  }
}
