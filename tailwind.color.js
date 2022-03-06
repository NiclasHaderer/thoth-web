module.exports = {
  variable(variable) {
    return ({ opacityValue }) => {
      if (opacityValue === undefined) {
        return `rgb(var(${variable}))`
      }
      return `rgb(var(${variable}) / ${opacityValue})`
    }
  },
}
