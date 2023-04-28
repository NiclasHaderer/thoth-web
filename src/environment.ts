export const environment = {
  production: !(!process.env.NODE_ENV || process.env.NODE_ENV === "development"),
  isHttps: (() => {
    if (typeof window === "undefined") return false
    return window.location.protocol === "https"
  })(),
}
