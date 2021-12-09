export const environment = {
  apiURL: process.env.REACT_APP_API_URL as string,
  production: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
  isHttps: window.location.protocol === 'https'
};
