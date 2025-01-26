export const environment = {
  production: !(!process.env.NODE_ENV || process.env.NODE_ENV === "development"),
  isHttps: (() => {
    return window.location.protocol === "https"
  })(),
}
