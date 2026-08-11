export const getSizing = (size: "small" | "normal") => {
  return {
    containerClasses: {
      small: "inline-block w-44",
      normal: "block w-full",
    }[size],
    widthClasses: {
      small: "w-44",
      normal: "w-full",
    }[size],
    heightClasses: {
      small: "h-44",
      normal: "aspect-square",
    }[size],
  }
}
