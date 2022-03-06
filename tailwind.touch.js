const plugin = require("tailwindcss/plugin")
const postcss = require("postcss")

module.exports = plugin(({ addVariant, e }) => {
  addVariant("touch", ({ container, separator }) => {
    const hoverHover = postcss.atRule({ name: "media", params: "(hover: none)" })

    hoverHover.append(container.nodes)
    container.append(hoverHover)
    hoverHover.walkRules(rule => {
      rule.selector = `.${e(`touch${separator}${rule.selector.slice(1)}`)}`
    })
  })
  addVariant("no-touch", ({ container, separator }) => {
    const hoverNone = postcss.atRule({ name: "media", params: "(hover: hover)" })

    hoverNone.append(container.nodes)
    container.append(hoverNone)
    hoverNone.walkRules(rule => {
      rule.selector = `.${e(`no-touch${separator}${rule.selector.slice(1)}`)}`
    })
  })
})
