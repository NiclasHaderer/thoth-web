export const environment = {
  apiURL: process.env.NEXT_PUBLIC_API_URL as string,
  production: !(!process.env.NODE_ENV || process.env.NODE_ENV === "development"),
  isHttps: (() => {
    if (typeof window === "undefined") return false
    return window.location.protocol === "https"
  })(),
}
